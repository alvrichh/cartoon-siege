/* Cartoon Siege's page: the landing (what the game is, in English and Spanish) and the game itself, which opens over
   it (`openSiege`) from the Play button, or at once with `?play` in the address (for game portals). */
import './style.css';
import { openSiege } from './siege/index';
import { audio, SIEGE_SOUNDS, type SiegeSound, type Sfx } from './audio';
import { makeT, pickLang, type Lang, type T } from './strings';
import { storage } from './lib/storage';
import { LANDING } from './landing';
import { importFromAddress } from './import';

importFromAddress();

const SETTINGS = 'cartoonSiege.settings';
const LANG = 'cartoonSiege.lang';
const num = (v: unknown, fallback: number) => (typeof v === 'number' && v >= 0 && v <= 1 ? v : fallback);
const prefs = (() => {
  try { const v = JSON.parse(storage.get(SETTINGS) || '{}') as { music?: unknown; sfx?: unknown }; return { music: num(v.music, 0.6), sfx: num(v.sfx, 0.8) }; }
  catch { return { music: 0.6, sfx: 0.8 }; }
})();
audio.setVolumes(prefs.music, prefs.sfx);

let lang: Lang = pickLang();
let t: T = makeT(lang);

/** The landing's texts in the chosen language (`data-i18n` keys, from `landing.ts`). */
function paintLanding() {
  document.documentElement.lang = lang;
  const words = LANDING[lang];
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => { const k = el.dataset.i18n as keyof typeof words; if (words[k]) el.textContent = words[k]; });
  document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  document.title = words.title;
}
function setLang(next: Lang) {
  lang = next; t = makeT(lang); storage.set(LANG, lang); paintLanding();
  return t;
}

/** The sound starts on the first touch or key (browsers keep it silent until then). */
let unlocked = false;
function unlockAudio() {
  if (unlocked) return;
  unlocked = true;
  audio.unlock();
  if (prefs.music > 0) audio.start();
}
for (const e of ['pointerdown', 'keydown'] as const) window.addEventListener(e, unlockAudio, { capture: true, once: true });

const SONGS = { menu: 'cartoon-menu', battle: 'cartoon-battle', boss: 'cartoon-boss', 'villain-menu': 'cartoon-villain-menu', villain: 'cartoon-villain' } as const;
let playing = false;
function play() {
  if (playing) return;
  playing = true;
  unlockAudio();
  document.body.classList.add('is-playing');
  openSiege(
    t,
    () => { playing = false; document.body.classList.remove('is-playing'); audio.stop(); },
    { pic: '', name: '' },
    (name, vol, pan) => ((SIEGE_SOUNDS as readonly string[]).includes(name) ? audio.siege(name as SiegeSound, vol, pan) : audio.play(name as Sfx)),
    (song) => { if (song) { audio.setSong(SONGS[song]); if (prefs.music > 0) audio.start(); } else audio.stop(); },
    {
      get: () => [prefs.music, prefs.sfx],
      set: (music, sfx) => { prefs.music = music; prefs.sfx = sfx; audio.setVolumes(music, sfx); storage.set(SETTINGS, JSON.stringify(prefs)); },
      lang: () => lang,
      setLang,
    },
  );
}

document.addEventListener('click', (e) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-play], [data-lang]');
  if (!el) return;
  if (el.dataset.lang) setLang(el.dataset.lang === 'es' ? 'es' : 'en');
  else play();
});
paintLanding();
if (new URLSearchParams(location.search).has('play')) play();
