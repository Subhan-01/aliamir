import type { RefObject } from 'react'
import { gsap, ScrollTrigger, useGSAP } from './registry'
import type { SplitText } from './registry'
import { MQ, fontsReady, prefersReducedMotion } from './env'
import { introGate } from './gate'
import {
  EASE,
  animatedDivider,
  depthParallax,
  drawLine,
  hoverWords,
  magneticButton,
  marquee,
  maskReveal,
  parallaxImage,
  scrubTextReveal,
  smoothSectionReveal,
  splitTextReveal,
  spotlight,
  staggerReveal,
  tiltOnPointer,
} from './utils'

interface Conditions {
  desktop: boolean
  mobile: boolean
  fine: boolean
}

/**
 * Motion for one page (mounted/unmounted with the route).
 *
 * Markup contract (all optional; the page markup only carries data-attributes):
 *   [data-hero="kicker|title|lead|actions|proof|art"]  hero entrance, in DOM order
 *   .reveal                      generic staggered fade-up (batched)
 *   [data-split="heading"]       words rise out of a mask, blur -> sharp
 *   [data-split="quote"]         slower version for quotations
 *   [data-split="chars"]         scroll-scrubbed character illumination (desktop)
 *   [data-split="story"]         scroll-scrubbed word illumination (desktop)
 *   [data-mask-img]              clip-path image reveal + slow zoom + parallax
 *   [data-count][data-suffix]    count-up (the real value is already in the markup)
 *   [data-draw]                  1px line that draws in
 *   [data-rise]                  section that settles upward as it enters
 *   .rule-top / .info-card ...   CSS draws their lines from the `.is-in` class
 */
export function usePageMotion(scopeRef: RefObject<HTMLElement | null>) {
  useGSAP(
    (_context, contextSafe) => {
      const root = scopeRef.current
      if (!root) return
      const reduce = prefersReducedMotion()
      let cancelled = false
      const safe = <F extends (...a: never[]) => unknown>(fn: F): F => (contextSafe ? (contextSafe(fn as never) as unknown as F) : fn)

      const qsa = <T extends HTMLElement = HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T>(sel))
      const heroEls = qsa('[data-hero]')
      const heroOf = (kind: string) => heroEls.filter((el) => el.dataset.hero === kind)

      /* ------------------------------------------------------------------ */
      /* Reduced motion: no movement. Short fades only, real values in DOM.  */
      /* ------------------------------------------------------------------ */
      if (reduce) {
        staggerReveal(qsa('.reveal'), { y: 0, duration: 0.3, stagger: 0 })
        animatedDivider(qsa('.rule-top, .rule-bottom'))
        qsa('[data-draw]').forEach((el) => el.classList.add('is-in'))
        const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 50)
        return () => window.clearTimeout(refresh)
      }

      /* ------------------------------------------------------------------ */
      /* Hide hero pieces synchronously (before first paint) so nothing      */
      /* flashes while we wait for the loader / fonts.                       */
      /* ------------------------------------------------------------------ */
      gsap.set(heroEls.filter((el) => el.dataset.hero !== 'art'), { autoAlpha: 0 })
      gsap.set(heroOf('art'), { clipPath: 'inset(0% 0% 100% 0%)' })

      const splitsToRevert: SplitText[] = []
      const cleanups: Array<() => void> = []
      const heroDisposers: Array<() => void> = []
      const fineNow = window.matchMedia(MQ.fine).matches
      let introPlayed = false

      const playIntro = safe(() => {
        if (introPlayed || cancelled) return
        introPlayed = true
        const tl = gsap.timeline({ defaults: { ease: EASE.out } })
        let at = 0.05

        heroEls.forEach((el) => {
          const kind = el.dataset.hero
          if (kind === 'title') {
            const { split } = splitTextReveal(el, {
              animate: 'words',
              mask: true,
              blur: true,
              yPercent: 115,
              duration: 1.1,
              stagger: 0.08,
              timeline: tl,
              position: at,
              onDone: fineNow ? (node) => heroDisposers.push(hoverWords(node)) : undefined,
            })
            splitsToRevert.push(split)
            gsap.set(el, { autoAlpha: 1 }) // words are hidden individually now
            at += 0.55
          } else if (kind === 'lead') {
            const { split } = splitTextReveal(el, {
              animate: 'lines',
              mask: true,
              blur: false,
              yPercent: 100,
              duration: 0.95,
              stagger: 0.1,
              timeline: tl,
              position: at,
              onDone: fineNow ? (node) => heroDisposers.push(hoverWords(node)) : undefined,
            })
            splitsToRevert.push(split)
            gsap.set(el, { autoAlpha: 1 })
            at += 0.4
          } else if (kind === 'art') {
            tl.fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: EASE.mask }, 0.1)
            const img = el.querySelector('img')
            if (img) tl.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.9, ease: EASE.out }, 0.1)
          } else if (kind === 'line') {
            gsap.set(el, { autoAlpha: 1 })
            const path = el.querySelector('.hero-path')
            const spark = el.querySelector('.hero-spark')
            if (path) tl.fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut' }, 0.6)
            if (spark) tl.fromTo(spark, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 2.2)
          } else if (kind === 'chips') {
            gsap.set(el, { autoAlpha: 1 })
            tl.fromTo(
              el.querySelectorAll('.node-in'),
              { scale: 0.4, autoAlpha: 0 },
              { scale: 1, autoAlpha: 1, duration: 0.8, ease: 'back.out(2)', stagger: 0.18, clearProps: 'transform' },
              1.0,
            )
          } else {
            tl.fromTo(
              el,
              { y: 20, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.8, clearProps: 'transform' },
              at,
            )
            at += 0.14
          }
        })

        if (fineNow) {
          tl.call(
            safe(() => {
              heroEls
                .filter((n) => n.dataset.hero === 'quote' || n.dataset.hero === 'body')
                .forEach((n) => heroDisposers.push(hoverWords(n)))
            }),
          )
        }

        // gentle floating of the hero portrait once it has landed
        const art = heroOf('art')[0]
        if (art) {
          tl.call(
            safe(() => {
              gsap.to(art, {
                y: -10,
                duration: 5.5,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', toggleActions: 'play pause resume pause' },
              })
            }),
          )
        }
      })

      const cancelGate = introGate.whenOpen(() => {
        // hero waits for fonts as well, so words never reflow mid-animation
        void fontsReady().then(() => {
          if (!cancelled) playIntro()
        })
      })

      /* ------------------------------------------------------------------ */
      /* Scroll systems (rebuilt automatically when breakpoints change)      */
      /* ------------------------------------------------------------------ */
      const build = (c: Conditions) => {
        const local: SplitText[] = []
        const keep = (r: { split: SplitText }) => local.push(r.split)

        // 1. generic staggered reveals
        staggerReveal(qsa('.reveal'), { y: c.mobile ? 28 : 44, duration: c.mobile ? 0.75 : 0.95 })

        // 2. text: headings, quotes, illuminated paragraphs
        qsa('[data-split="heading"]').forEach((el) =>
          keep(
            splitTextReveal(el, {
              animate: 'words',
              mask: true,
              blur: !c.mobile,
              duration: c.mobile ? 0.8 : 1.1,
              stagger: 0.055,
              onDone: c.fine ? (node) => cleanups.push(hoverWords(node)) : undefined,
            }),
          ),
        )
        qsa('[data-split="quote"]').forEach((el) =>
          keep(
            splitTextReveal(el, {
              animate: 'words',
              mask: true,
              duration: 1.2,
              stagger: 0.07,
              start: 'top 88%',
              onDone: c.fine ? (node) => cleanups.push(hoverWords(node)) : undefined,
            }),
          ),
        )
        const illuminate = (el: HTMLElement, animate: 'chars' | 'words', from: number, start: string, end: string) =>
          c.desktop && !c.mobile
            ? keep(scrubTextReveal(el, { animate, from, start, end }))
            : keep(splitTextReveal(el, { animate: 'words', mask: false, blur: false, yPercent: 30, duration: 0.8, stagger: 0.03 }))
        qsa('[data-split="chars"]').forEach((el) => illuminate(el, 'chars', 0.16, 'top 82%', 'bottom 52%'))
        qsa('[data-split="story"]').forEach((el) => illuminate(el, 'words', 0.14, 'top 75%', 'bottom 60%'))

        // 3. images
        qsa('[data-mask-img]').forEach((frame, i) => {
          maskReveal(frame, { direction: i % 2 ? 'left' : 'up', delay: 0.1 })
          if (!c.mobile) parallaxImage(frame.querySelector<HTMLElement>('img'), frame, { yPercent: 4 })
        })
        const heroImg = heroOf('art')[0]?.querySelector<HTMLElement>('img')
        const heroFrame = heroOf('art')[0]
        if (heroImg && heroFrame && c.desktop) {
          gsap.to(heroImg, {
            yPercent: -4,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top top', end: '+=900', scrub: true },
          })
        }

        // 3b. stacking cards: the card being covered shrinks and dims as the next one slides over it
        qsa('[data-stack]').forEach((stack) => {
          const cards = Array.from(stack.querySelectorAll<HTMLElement>('.stack-card'))
          cards.forEach((card, i) => {
            const next = cards[i + 1]
            if (!next) return
            const inner = card.querySelector<HTMLElement>('.stack-in')
            const dim = card.querySelector<HTMLElement>('.stack-dim')
            const trigger = { trigger: next, start: 'top 85%', end: 'top 22%', scrub: true }
            if (inner) gsap.to(inner, { scale: c.mobile ? 0.96 : 0.92, ease: 'none', scrollTrigger: trigger })
            if (dim) gsap.to(dim, { opacity: 0.6, ease: 'none', scrollTrigger: trigger })
          })
        })

        // 4. numbers
        qsa('[data-count]').forEach((el, i) => {
          const target = Number(el.dataset.count)
          const suffix = el.dataset.suffix ?? ''
          if (!Number.isFinite(target)) return
          const final = `${target}${suffix}`
          const holder = { v: 0 }
          el.textContent = `0${suffix}`
          const trigger = { trigger: el.closest<HTMLElement>('.stat-item') ?? el, start: 'top 85%', once: true }
          gsap.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: i * 0.12, ease: EASE.out, scrollTrigger: trigger })
          gsap.to(holder, {
            v: target,
            duration: 1.8,
            delay: 0.15 + i * 0.12,
            ease: 'power3.out',
            scrollTrigger: trigger,
            onUpdate: () => {
              el.textContent = `${Math.round(holder.v)}${suffix}`
            },
            onComplete: () => {
              el.textContent = final // always land on the exact original value
            },
          })
        })
        // values that are not counted (∞, 0) still get the staggered number reveal
        qsa('[data-stat-static]').forEach((el, i) =>
          gsap.fromTo(
            el,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              delay: i * 0.12,
              ease: EASE.out,
              scrollTrigger: { trigger: el.closest<HTMLElement>('.stat-item') ?? el, start: 'top 85%', once: true },
            },
          ),
        )

        // 5. lines & section settle
        drawLine(qsa('[data-draw]'))
        animatedDivider(qsa('.rule-top, .rule-bottom'))
        if (!c.mobile) qsa('[data-rise]').forEach((s) => smoothSectionReveal(s, { y: 48 }))

        // 5b. ticker that reacts to scrolling (speeds up, reverses when scrolling up)
        qsa('[data-marquee]').forEach((t) => cleanups.push(marquee(t, c.mobile ? 22 : 32)))

        // 6. pointer interactions (mouse only)
        if (c.fine) {
          root.classList.add('fx-fine')
          qsa('.button, .whatsapp-link').forEach((el) => cleanups.push(magneticButton(el)))
          const art = heroOf('art')[0]
          if (art && c.desktop) cleanups.push(tiltOnPointer(root, art, 3.5))
          qsa('.info-card, .contact-form').forEach((el) => cleanups.push(spotlight(el)))
          const depthItems = qsa('[data-depth]')
          if (depthItems.length && c.desktop) cleanups.push(depthParallax(root, depthItems))
          // every paragraph becomes word-reactive (hero copy is handled by the intro)
          qsa('.body-copy, .large-copy, .block-sub, .page-hero-body, .footer-copy, .footer-sub, .belief-note, .accent-note').forEach((el) => {
            if (el.closest('[data-hero]') || el.hasAttribute('data-split')) return
            cleanups.push(hoverWords(el))
          })
        }

        const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 60)
        return () => {
          window.clearTimeout(refresh)
          root.classList.remove('fx-fine')
          cleanups.splice(0).forEach((fn) => fn())
          local.forEach((s) => s.revert())
        }
      }

      let mm: gsap.MatchMedia | null = null
      void fontsReady().then(() => {
        if (cancelled) return
        mm = gsap.matchMedia()
        mm.add({ desktop: MQ.desktop, mobile: MQ.mobile, fine: MQ.fine }, (ctx) => {
          const cond = ((ctx as unknown as { conditions?: Record<string, boolean> }).conditions ?? {}) as Partial<Conditions>
          return build({ desktop: !!cond.desktop, mobile: !!cond.mobile, fine: !!cond.fine })
        })
      })

      // Failsafe so a hero can never stay hidden.
      const failsafe = window.setTimeout(() => {
        if (cancelled || introPlayed) return
        gsap.set(heroEls, { autoAlpha: 1, clearProps: 'clipPath' })
      }, 8000)

      return () => {
        cancelled = true
        cancelGate()
        window.clearTimeout(failsafe)
        mm?.revert()
        splitsToRevert.forEach((s) => s.revert())
        heroDisposers.splice(0).forEach((fn) => fn())
        cleanups.splice(0).forEach((fn) => fn())
      }
    },
    { scope: scopeRef },
  )
}
