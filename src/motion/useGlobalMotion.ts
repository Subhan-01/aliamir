import { useRef, type RefObject } from 'react'
import { gsap, ScrollTrigger, useGSAP } from './registry'
import { MQ, markLoaderSeen, prefersReducedMotion } from './env'
import { introGate } from './gate'
import { EASE, initCursor, logoSheenOnHover, scrollProgress, sheenTween } from './utils'

interface Options {
  /** whether the loader is mounted (decided once, before first render) */
  loader: boolean
  onLoaderDone: () => void
}

/**
 * Site-wide motion that lives for the whole session: loader, nav entrance,
 * nav background on scroll, scroll progress, custom cursor and logo sheen.
 * Per-page motion lives in usePageMotion.
 */
export function useGlobalMotion(rootRef: RefObject<HTMLElement | null>, options: Options) {
  const optsRef = useRef(options)
  optsRef.current = options

  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current
      if (!root) return
      const html = document.documentElement
      const reduce = prefersReducedMotion()
      const cleanups: Array<() => void> = []
      let cancelled = false
      const safe = <F extends (...a: never[]) => unknown>(fn: F): F => (contextSafe ? (contextSafe(fn as never) as unknown as F) : fn)

      root.classList.add('fx-ready')
      const nav = root.querySelector<HTMLElement>('.site-nav')
      const loaderEl = root.querySelector<HTMLElement>('.loader')

      const finishLoader = () => {
        if (loaderEl) loaderEl.style.display = 'none'
        html.classList.remove('is-loading')
        markLoaderSeen()
        optsRef.current.onLoaderDone()
      }

      // ---- always on (reduced motion keeps these: they are not motion-heavy) ----
      scrollProgress(root.querySelector<HTMLElement>('.scroll-progress'))
      if (nav) {
        ScrollTrigger.create({ start: 42, end: 'max', toggleClass: { targets: nav, className: 'is-scrolled' } })
      }

      if (reduce) {
        finishLoader()
        introGate.open()
        return () => {
          root.classList.remove('fx-ready')
        }
      }

      // ---- motion path ----
      const fine = window.matchMedia(MQ.fine).matches
      if (fine) {
        cleanups.push(initCursor(root))
        cleanups.push(logoSheenOnHover(root.querySelector<HTMLElement>('.brand-logo-frame')))
      }

      const navIntro = safe(() => {
        if (!nav) return
        gsap.fromTo(
          nav,
          { y: -26, autoAlpha: 0, filter: 'blur(10px)' },
          {
            y: 0,
            autoAlpha: 1,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: EASE.out,
            clearProps: 'filter',
            onComplete: () => {
              const frame = root.querySelector<HTMLElement>('.brand-logo-frame')
              if (frame) sheenTween(frame)
            },
          },
        )
      })
      if (nav) gsap.set(nav, { autoAlpha: 0 })

      const handOver = safe(() => {
        introGate.open()
        navIntro()
      })

      if (options.loader && loaderEl) {
        html.classList.add('is-loading')
        const l = gsap.timeline({ defaults: { ease: EASE.out }, onComplete: finishLoader })
        l.fromTo('.loader-logo-wrap', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.1)
          .fromTo(
            '.loader-logo',
            { clipPath: 'inset(0% 0% 0% 100%)', scale: 1.08 }, // Urdu reads right-to-left: reveal from the right edge
            { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.1, ease: EASE.mask },
            0.25,
          )
          .fromTo('.loader-logo-wrap .logo-sheen', { xPercent: -130 }, { xPercent: 130, duration: 1.1, ease: 'power2.inOut' }, 0.95)
          .fromTo(
            '.loader-line',
            { scaleX: 0, transformOrigin: 'left center' },
            { scaleX: 1, duration: 0.85, ease: 'power2.inOut' },
            0.8,
          )
          .addLabel('exit', '>+0.15')
          .to('.loader-inner', { autoAlpha: 0, y: -14, duration: 0.45, ease: 'power2.in' }, 'exit')
          .to('.loader', { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, 'exit+=0.15')
          .call(handOver, undefined, 'exit+=0.5') // page hero starts while the curtain is still lifting
      } else {
        finishLoader()
        handOver()
      }

      // Failsafe: never leave the site hidden or locked if something above throws.
      const failsafe = window.setTimeout(() => {
        if (cancelled) return
        if (!introGate.isOpen) {
          if (nav) gsap.set(nav, { autoAlpha: 1, clearProps: 'filter' })
          finishLoader()
          introGate.open()
        }
      }, 7000)

      return () => {
        cancelled = true
        window.clearTimeout(failsafe)
        cleanups.forEach((fn) => fn())
        html.classList.remove('is-loading')
        root.classList.remove('fx-ready')
      }
    },
    { scope: rootRef },
  )
}
