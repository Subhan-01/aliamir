/** Media queries + environment helpers shared by the motion system. */
export const MQ = {
  reduce: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 1024px)',
  mobile: '(max-width: 819px)',
  fine: '(any-hover: hover) and (any-pointer: fine)',
} as const

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia(MQ.reduce).matches

const LOADER_KEY = 'aa:loader-seen'

/**
 * The cinematic loader is shown once per browser session, never for
 * reduced-motion users and never when the visitor deep-links to a section.
 */
export function shouldShowLoader(): boolean {
  if (typeof window === 'undefined') return false
  if (prefersReducedMotion()) return false
  if (window.location.hash && window.location.hash !== '#home') return false
  try {
    return window.sessionStorage.getItem(LOADER_KEY) !== '1'
  } catch {
    return true
  }
}

export function markLoaderSeen(): void {
  try {
    window.sessionStorage.setItem(LOADER_KEY, '1')
  } catch {
    /* storage unavailable (private mode) — loader may replay, which is harmless */
  }
}

/** Resolve once web fonts are ready, but never block longer than `max` ms. */
export function fontsReady(max = 1500): Promise<void> {
  const ready = document.fonts?.ready ?? Promise.resolve()
  return Promise.race([ready.then(() => undefined), new Promise<void>((resolve) => window.setTimeout(resolve, max))])
}
