import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { RefObject } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type Conditions = { reduceMotion: boolean; desktop: boolean }

export function useAliAmirMotion(rootRef: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const root = rootRef.current
    if (!root) return

    const loaderTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
    loaderTimeline
      .fromTo('.loader-kicker', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.45 })
      .fromTo('.loader-logo-wrap', { autoAlpha: 0, scale: 0.82, rotation: -5, filter: 'blur(8px)' }, { autoAlpha: 1, scale: 1, rotation: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' }, '-=0.18')
      .fromTo('.loader-line', { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.8, ease: 'power2.inOut' }, '-=0.16')
      .to('.loader', { autoAlpha: 0, yPercent: -100, duration: 0.8, delay: 0.25, ease: 'power4.inOut' })

    const mm = gsap.matchMedia()
    mm.add(
      {
        reduceMotion: '(prefers-reduced-motion: reduce)',
        desktop: '(min-width: 900px)',
      },
      (context) => {
        const { reduceMotion, desktop } = context.conditions as Conditions

        if (reduceMotion) {
          gsap.set('.reveal, .hero-copy > *, .hero-art, .loader', { autoAlpha: 1, clearProps: 'transform' })
          gsap.set('.loader', { autoAlpha: 0, display: 'none' })
          return
        }

        const intro = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 1.25 })
        intro
          .fromTo('.site-nav', { y: -20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.65 })
          .fromTo('.hero-kicker', { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55 }, '-=0.28')
          .fromTo('.hero-title .line', { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08 }, '-=0.22')
          .fromTo('.hero-lead', { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55 }, '-=0.28')
          .fromTo('.hero-actions .magnetic', { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.08 }, '-=0.24')
          .fromTo('.hero-art', { clipPath: 'inset(0 0 100% 0)', scale: 1.06 }, { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1.15, ease: 'power4.inOut' }, '-=0.85')
          .fromTo('.hero-art-label', { x: 20, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5, stagger: 0.09 }, '-=0.55')

        gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
          gsap.fromTo(
            element,
            { y: 38, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: desktop ? 0.75 : 0.55,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: element,
                start: 'top 86%',
                once: true,
              },
            },
          )
        })

        gsap.utils.toArray<HTMLElement>('.line-reveal').forEach((element) => {
          gsap.fromTo(
            element,
            { scaleX: 0, transformOrigin: 'left center' },
            {
              scaleX: 1,
              duration: 0.9,
              ease: 'power2.inOut',
              scrollTrigger: { trigger: element, start: 'top 88%', once: true },
            },
          )
        })

        gsap.utils.toArray<HTMLElement>('[data-count]').forEach((element) => {
          const target = Number(element.dataset.count ?? 0)
          const suffix = element.dataset.suffix ?? ''
          const counter = { value: 0 }
          gsap.to(counter, {
            value: target,
            duration: 1.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 82%', once: true },
            onUpdate: () => {
              element.textContent = `${Math.round(counter.value)}${suffix}`
            },
          })
        })

        gsap.to('.marquee-track', {
          xPercent: -50,
          duration: 25,
          repeat: -1,
          ease: 'none',
        })

        if (desktop) {
          gsap.to('.statement-image', {
            yPercent: -12,
            ease: 'none',
            scrollTrigger: {
              trigger: '.statement-section',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          })

          gsap.to('.hero-art-image', {
            yPercent: -5,
            xPercent: 2,
            ease: 'none',
            scrollTrigger: {
              trigger: '.hero',
              start: 'top top',
              end: 'bottom top',
              scrub: 1.1,
            },
          })
        }

        gsap.to('.scroll-progress', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: 0.2 },
        })
      },
    )

    const pointer = (event: PointerEvent) => {
      root.style.setProperty('--pointer-x', `${event.clientX}px`)
      root.style.setProperty('--pointer-y', `${event.clientY}px`)
      root.style.setProperty('--cursor-x', `${event.clientX}px`)
      root.style.setProperty('--cursor-y', `${event.clientY}px`)
    }

    const interactiveSelector = 'a, button, input, textarea, select, [role="button"], .magnetic'
    const cursorHover = (event: PointerEvent) => {
      const current = event.target instanceof Element ? event.target.closest(interactiveSelector) : null
      if (event.type === 'pointerover') {
        if (current) root.classList.add('cursor-hover')
        return
      }

      const related = event.relatedTarget
      if (related instanceof Node && current?.contains(related)) return
      const next = related instanceof Element ? related.closest(interactiveSelector) : null
      root.classList.toggle('cursor-hover', Boolean(next))
    }
    const cursorPress = (event: PointerEvent) => {
      if (event.isPrimary && event.button === 0) root.classList.add('cursor-pressed')
    }
    const cursorRelease = () => root.classList.remove('cursor-pressed')

    const applyMagneticMotion = (element: HTMLElement) => {
      const move = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect()
        const offsetX = event.clientX - rect.left - rect.width / 2
        const offsetY = event.clientY - rect.top - rect.height / 2
        const x = offsetX * 0.18
        const y = offsetY * 0.18
        element.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.02)`
        element.style.boxShadow = `0 18px 35px rgba(200, 167, 107, 0.08), ${x * 0.08}px ${y * 0.08}px 0 rgba(200, 167, 107, 0.08)`
      }

      const reset = () => {
        element.style.transform = ''
        element.style.boxShadow = ''
      }

      element.addEventListener('pointermove', move)
      element.addEventListener('pointerleave', reset)
      element.addEventListener('pointercancel', reset)

      return () => {
        element.removeEventListener('pointermove', move)
        element.removeEventListener('pointerleave', reset)
        element.removeEventListener('pointercancel', reset)
      }
    }

    const supportsFinePointer = window.matchMedia('(pointer: fine)').matches
    if (supportsFinePointer) {
      root.classList.add('has-custom-cursor')
      window.addEventListener('pointermove', pointer, { passive: true })
      root.addEventListener('pointerover', cursorHover)
      root.addEventListener('pointerout', cursorHover)
      root.addEventListener('pointerdown', cursorPress)
      window.addEventListener('pointerup', cursorRelease)
      window.addEventListener('pointercancel', cursorRelease)
      const magneticElements = Array.from(root.querySelectorAll<HTMLElement>('.magnetic'))
      const magneticCleanup = magneticElements.map(applyMagneticMotion)

      return () => {
        root.classList.remove('has-custom-cursor', 'cursor-hover')
        window.removeEventListener('pointermove', pointer)
        root.removeEventListener('pointerover', cursorHover)
        root.removeEventListener('pointerout', cursorHover)
        root.removeEventListener('pointerdown', cursorPress)
        window.removeEventListener('pointerup', cursorRelease)
        window.removeEventListener('pointercancel', cursorRelease)
        magneticCleanup.forEach((cleanup) => cleanup())
        mm.revert()
      }
    }

    return () => {
      if (supportsFinePointer) window.removeEventListener('pointermove', pointer)
      mm.revert()
    }
  }, { scope: rootRef })
}
