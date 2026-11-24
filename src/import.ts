/* A save handed over in the address (`#save=…`, from the earlier home of the game): its keys are copied into this
   game's own save (`cartoonSiege.*`) only when there is no save here yet, so it never overwrites progress. The hash is
   then wiped from the address. `?lang=es|en` picks the language the same way, once. */
/** Keys that are progress (not the language or sound settings). */
const hasProgress = () => Object.keys(localStorage).some((k) => k.startsWith('cartoonSiege.') && !/\.(lang|settings)$/.test(k));

function fromB64(s: string): string {
  const b = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  return new TextDecoder().decode(Uint8Array.from(b, (c) => c.charCodeAt(0)));
}

export function importFromAddress() {
  try {
    const q = new URLSearchParams(location.search);
    const lang = q.get('lang');
    if (lang === 'es' || lang === 'en') localStorage.setItem('cartoonSiege.lang', lang);
    const hash = new URLSearchParams(location.hash.slice(1)).get('save');
    if (hash) {
      if (!hasProgress()) {
        const parsed = JSON.parse(fromB64(hash)) as { v?: number; data?: Record<string, unknown> };
        if (parsed.v === 1 && parsed.data && typeof parsed.data === 'object') {
          for (const [k, v] of Object.entries(parsed.data)) if (/^[a-z0-9.]+$/i.test(k) && typeof v === 'string' && v.length < 500_000) localStorage.setItem(`cartoonSiege.${k}`, v);
        }
      }
      history.replaceState(null, '', location.pathname + location.search);
    }
  } catch { /* a broken or cut link: start fresh */ }
}
