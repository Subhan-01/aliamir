/**
 * Reusable animation utilities for the Ali Amir site.
 *
 * Every function is meant to be called inside a gsap.context / useGSAP scope
 * so tweens and ScrollTriggers are reverted automatically on unmount.
 * Functions that attach DOM listeners return a cleanup function.
 *
 * Property ownership (so GSAP and Framer Motion never fight over one property):
 *   - GSAP owns every element in the page body, loader, hero, nav entrance.
 *   - Framer Motion owns only the mobile menu panel/links, the menu-toggle icon
 *     and the form feedback messages. GSAP never touches those.
 */
import { gsap, ScrollTrigger, SplitText } from './registry'

export const EASE = {
  out: 'power3.out',
  inOut: 'power3.inOut',
  mask: 'power4.inOut',
} as const

const toEls = (targets: gsap.DOMTarget): HTMLElement[] => gsap.utils.toArray<HTMLElement>(targets)

/* -------------------------------------------------------------------------- */
/* FadeIn                                                                      */
/* -------------------------------------------------------------------------- */

export interface FadeInOptions {
  y?: number
  x?: number
  duration?: number
  delay?: number
  stagger?: number
  start?: string
  trigger?: Element | string
  ease?: string
  /** false = play immediately instead of on scroll */
  scroll?: boolean
}

/** Opacity + small translate entrance. Uses opacity (not visibility) so keyboard focus still works. */
export function fadeIn(targets: gsap.DOMTarget, o: FadeInOptions = {}) {
  const els = toEls(targets)
  if (!els.length) return null
  return gsap.fromTo(
    els,
    { opacity: 0, y: o.y ?? 32, x: o.x ?? 0 },
    {
      opacity: 1,
      y: 0,
      x: 0,
      duration: o.duration ?? 0.9,
      delay: o.delay ?? 0,
      stagger: o.stagger ?? 0,
      ease: o.ease ?? EASE.out,
      clearProps: 'transform',
      scrollTrigger:
        o.scroll === false ? undefined : { trigger: o.trigger ?? els[0], start: o.start ?? 'top 88%', once: true },
    },
  )
}

/* -------------------------------------------------------------------------- */
/* StaggerReveal                                                               */
/* -------------------------------------------------------------------------- */

export interface StaggerRevealOptions {
  y?: number
  duration?: number
  stagger?: number
  start?: string
}

/**
 * One batched ScrollTrigger for many elements: siblings that enter together are
 * staggered, everything fires once. Adds `.is-in` so CSS can draw dividers/lines.
 */
export function staggerReveal(targets: gsap.DOMTarget, o: StaggerRevealOptions = {}) {
  const els = toEls(targets)
  if (!els.length) return []
  const y = o.y ?? 44
  gsap.set(els, { opacity: 0, y })
  return ScrollTrigger.batch(els, {
    start: o.start ?? 'top 88%',
    once: true,
    interval: 0.1,
    batchMax: 6,
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: o.duration ?? 0.95,
        ease: EASE.out,
        stagger: o.stagger ?? 0.1,
        overwrite: 'auto',
        clearProps: 'transform', // hand transforms back to CSS (e.g. card hover lift)
      })
      batch.forEach((el) => el.classList.add('is-in'))
    },
  })
}

/* -------------------------------------------------------------------------- */
/* SplitTextReveal                                                             */
/* -------------------------------------------------------------------------- */

export interface SplitRevealOptions {
  animate?: 'words' | 'lines' | 'chars'
  /** clip each line so text rises out of a mask (default true) */
  mask?: boolean
  /** one-time blur-to-sharp (default true) */
  blur?: boolean
  yPercent?: number
  duration?: number
  stagger?: number
  delay?: number
  ease?: string
  start?: string
  trigger?: Element
  /** insert into this timeline instead of using a ScrollTrigger */
  timeline?: gsap.core.Timeline
  position?: gsap.Position
  /** called after the split has been reverted (original markup restored) */
  onDone?: (el: HTMLElement) => void
}

export function makeSplit(el: HTMLElement, animate: 'words' | 'lines' | 'chars', mask: boolean): SplitText {
  const type =
    animate === 'lines'
      ? 'lines'
      : animate === 'words'
        ? mask
          ? 'lines,words'
          : 'words'
        : mask
          ? 'lines,words,chars'
          : 'words,chars'
  const split = SplitText.create(el, {
    type,
    linesClass: 'split-line',
    wordsClass: 'split-word',
    charsClass: 'split-char',
    ...(mask ? { mask: 'lines' as const } : {}),
  })
  // Give clipped lines a little breathing room so descenders / italic swashes are not cut.
  const masks = (split as unknown as { masks?: HTMLElement[] }).masks
  masks?.forEach((m) => {
    m.style.paddingBlock = '0.14em'
    m.style.marginBlock = '-0.14em'
  })
  return split
}

/**
 * Words / lines / characters rise out of a mask with a soft blur-to-sharp.
 * The split is reverted when the reveal completes, so the final DOM and
 * typography are exactly the original markup (kerning, wrapping, copy/paste).
 */
export function splitTextReveal(el: HTMLElement, o: SplitRevealOptions = {}) {
  const animate = o.animate ?? 'words'
  const mask = o.mask ?? true
  const blur = o.blur !== false
  const split = makeSplit(el, animate, mask)
  const targets = animate === 'chars' ? split.chars : animate === 'lines' ? split.lines : split.words

  const from: gsap.TweenVars = { opacity: 0, yPercent: o.yPercent ?? 105 }
  const to: gsap.TweenVars = {
    opacity: 1,
    yPercent: 0,
    duration: o.duration ?? 1,
    ease: o.ease ?? 'power4.out',
    stagger: o.stagger ?? 0.06,
    onComplete: () => {
      split.revert()
      o.onDone?.(el)
    },
  }
  if (blur) {
    from.filter = 'blur(8px)'
    to.filter = 'blur(0px)'
  }

  if (o.timeline) {
    o.timeline.fromTo(targets, from, to, o.position)
  } else {
    gsap.fromTo(targets, from, {
      ...to,
      delay: o.delay ?? 0,
      scrollTrigger: { trigger: o.trigger ?? el, start: o.start ?? 'top 85%', once: true },
    })
  }
  return { split }
}

export interface ScrubTextOptions {
  animate?: 'words' | 'chars'
  from?: number
  start?: string
  end?: string
}

/** Scroll-scrubbed illumination: characters/words fade from dim to full as the reader scrolls. */
export function scrubTextReveal(el: HTMLElement, o: ScrubTextOptions = {}) {
  const animate = o.animate ?? 'chars'
  const split = makeSplit(el, animate, false)
  const targets = animate === 'chars' ? split.chars : split.words
  gsap.fromTo(
    targets,
    { opacity: o.from ?? 0.16 },
    {
      opacity: 1,
      ease: 'none',
      duration: 0.25,
      stagger: { each: 0.05 },
      scrollTrigger: { trigger: el, start: o.start ?? 'top 82%', end: o.end ?? 'bottom 50%', scrub: 0.6 },
    },
  )
  return { split }
}

/* -------------------------------------------------------------------------- */
/* MaskReveal / ParallaxImage                                                  */
/* -------------------------------------------------------------------------- */

export interface MaskRevealOptions {
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  start?: string
  scaleFrom?: number
  scaleTo?: number
}

const MASK_HIDDEN = {
  up: 'inset(100% 0% 0% 0%)',
  down: 'inset(0% 0% 100% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
} as const

/** Cinematic clip-path reveal on a frame, with the image easing from a slight zoom. */
export function maskReveal(frame: HTMLElement, o: MaskRevealOptions = {}) {
  const img = frame.querySelector<HTMLElement>('img')
  const tl = gsap.timeline({
    delay: o.delay ?? 0,
    scrollTrigger: { trigger: frame, start: o.start ?? 'top 82%', once: true },
    onStart: () => frame.classList.add('is-in'),
  })
  tl.fromTo(
    frame,
    { clipPath: MASK_HIDDEN[o.direction ?? 'up'] },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.35, ease: EASE.mask },
    0,
  )
  if (img) {
    tl.fromTo(img, { scale: o.scaleFrom ?? 1.3 }, { scale: o.scaleTo ?? 1.1, duration: 1.9, ease: EASE.out }, 0)
  }
  return tl
}

/**
 * Subtle parallax. The image is held at ~1.1 scale by maskReveal, so +/-4%
 * travel never exposes the frame edge and the photograph is not distorted.
 */
export function parallaxImage(img: HTMLElement | null, trigger: Element, o: { yPercent?: number } = {}) {
  if (!img) return null
  const yp = o.yPercent ?? 4
  return gsap.fromTo(
    img,
    { yPercent: -yp },
    { yPercent: yp, ease: 'none', scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true } },
  )
}

/* -------------------------------------------------------------------------- */
/* AnimatedDivider / ScrollProgress / SmoothSectionReveal                      */
/* -------------------------------------------------------------------------- */

/** Adds `.is-in` when a divider enters; CSS (enhance.css) draws the line from it. */
export function animatedDivider(targets: gsap.DOMTarget) {
  toEls(targets).forEach((el) =>
    ScrollTrigger.create({ trigger: el, start: 'top 94%', once: true, onEnter: () => el.classList.add('is-in') }),
  )
}

/** Draws real line elements (scaleX) from the left. */
export function drawLine(targets: gsap.DOMTarget) {
  toEls(targets).forEach((el) =>
    gsap.fromTo(
      el,
      { scaleX: 0, transformOrigin: 'left center' },
      {
        scaleX: 1,
        duration: 1.1,
        ease: EASE.inOut,
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      },
    ),
  )
}

export function scrollProgress(el: HTMLElement | null) {
  if (!el) return null
  return gsap.to(el, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } })
}

/** A panel that settles upward into place as it enters (transform only). */
export function smoothSectionReveal(section: HTMLElement | null, o: { y?: number } = {}) {
  if (!section) return null
  return gsap.fromTo(
    section,
    { y: o.y ?? 48 },
    {
      y: 0,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'top 70%', scrub: true, invalidateOnRefresh: true },
    },
  )
}

/* -------------------------------------------------------------------------- */
/* Logo sheen (soft golden light across the ORIGINAL logo artwork)             */
/* -------------------------------------------------------------------------- */

export function sheenTween(wrap: HTMLElement): gsap.core.Tween | null {
  const sheen = wrap.querySelector<HTMLElement>('.logo-sheen')
  if (!sheen) return null
  return gsap.fromTo(sheen, { xPercent: -130 }, { xPercent: 130, duration: 1.2, ease: 'power2.inOut', overwrite: true })
}

/** Replays the sheen on hover (fine pointers). Returns cleanup. */
export function logoSheenOnHover(wrap: HTMLElement | null): () => void {
  if (!wrap) return () => undefined
  const sheen = wrap.querySelector<HTMLElement>('.logo-sheen')
  if (sheen) gsap.set(sheen, { xPercent: -130 })
  const play = () => void sheenTween(wrap)
  wrap.addEventListener('pointerenter', play)
  return () => wrap.removeEventListener('pointerenter', play)
}

/* -------------------------------------------------------------------------- */
/* MagneticButton                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Element subtly follows the cursor and eases back. quickTo tweens are created
 * lazily on first hover so they never fight an entrance animation.
 * Mouse only; callers must not use this on touch / coarse pointers.
 */
export function magneticButton(el: HTMLElement, strength = 0.3): () => void {
  let xTo: ((v: number) => void) | null = null
  let yTo: ((v: number) => void) | null = null
  let cx = 0
  let cy = 0
  const LIFT = 3

  const onEnter = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    if (!xTo || !yTo) {
      xTo = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3' })
      yTo = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3' })
    }
    const r = el.getBoundingClientRect()
    // centre of the element at rest (remove any offset we already applied)
    cx = r.left + r.width / 2 - (gsap.getProperty(el, 'x') as number)
    cy = r.top + r.height / 2 - (gsap.getProperty(el, 'y') as number)
  }
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || !xTo || !yTo) return
    xTo((e.clientX - cx) * strength)
    yTo((e.clientY - cy) * strength - LIFT)
  }
  const onLeave = () => {
    xTo?.(0)
    yTo?.(0)
  }

  el.addEventListener('pointerenter', onEnter, { passive: true })
  el.addEventListener('pointermove', onMove, { passive: true })
  el.addEventListener('pointerleave', onLeave, { passive: true })
  return () => {
    el.removeEventListener('pointerenter', onEnter)
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerleave', onLeave)
    gsap.killTweensOf(el)
    gsap.set(el, { clearProps: 'x,y' })
  }
}

/* -------------------------------------------------------------------------- */
/* Pointer tilt (gentle 3D depth on one desktop element)                       */
/* -------------------------------------------------------------------------- */

export function tiltOnPointer(zone: HTMLElement, target: HTMLElement, max = 3.5): () => void {
  gsap.set(target, { transformPerspective: 1100 })
  const rx = gsap.quickTo(target, 'rotationX', { duration: 0.9, ease: 'power3' })
  const ry = gsap.quickTo(target, 'rotationY', { duration: 0.9, ease: 'power3' })
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const r = zone.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry(px * max * 2)
    rx(-py * max * 2)
  }
  const onLeave = () => {
    rx(0)
    ry(0)
  }
  zone.addEventListener('pointermove', onMove, { passive: true })
  zone.addEventListener('pointerleave', onLeave, { passive: true })
  return () => {
    zone.removeEventListener('pointermove', onMove)
    zone.removeEventListener('pointerleave', onLeave)
    gsap.killTweensOf(target)
    gsap.set(target, { clearProps: 'rotationX,rotationY,transformPerspective' })
  }
}

/* -------------------------------------------------------------------------- */
/* Custom cursor: dot + lagging ring + golden trail + click ripple + labels    */
/* -------------------------------------------------------------------------- */

export function initCursor(root: HTMLElement): () => void {
  const cursor = root.querySelector<HTMLElement>('.cursor')
  const dot = cursor?.querySelector<HTMLElement>('.cursor-dot') ?? null
  const ring = cursor?.querySelector<HTMLElement>('.cursor-ring') ?? null
  const label = cursor?.querySelector<HTMLElement>('.cursor-label') ?? null
  const glow = root.querySelector<HTMLElement>('.pointer-glow')
  if (!cursor || !dot || !ring || !label) return () => undefined

  gsap.set([dot, ring], { xPercent: -50, yPercent: -50 })
  const dx = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3' })
  const dy = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3' })
  const rx = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' })
  const ry = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' })
  let gx: ((v: number) => void) | null = null
  let gy: ((v: number) => void) | null = null
  if (glow) {
    gsap.set(glow, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 })
    gx = gsap.quickTo(glow, 'x', { duration: 1, ease: 'power3' })
    gy = gsap.quickTo(glow, 'y', { duration: 1, ease: 'power3' })
  }

  // golden comet trail: each dot chases the one before it
  const TRAIL = 10
  const trail = Array.from({ length: TRAIL }, (_, i) => {
    const el = document.createElement('span')
    el.className = 'cursor-trail'
    el.style.opacity = String(0.55 * (1 - i / TRAIL))
    cursor.insertBefore(el, cursor.firstChild)
    return { el, x: 0, y: 0 }
  })
  let mx = 0
  let my = 0
  let visible = false
  const tick = () => {
    if (!visible) return
    let px = mx
    let py = my
    trail.forEach((t, i) => {
      t.x += (px - t.x) * 0.36
      t.y += (py - t.y) * 0.36
      px = t.x
      py = t.y
      t.el.style.transform = `translate3d(${t.x}px,${t.y}px,0) translate(-50%,-50%) scale(${1 - i / (TRAIL * 1.15)})`
    })
  }
  gsap.ticker.add(tick)

  const setVisible = (v: boolean) => {
    if (v === visible) return
    visible = v
    cursor.classList.toggle('is-visible', v)
  }

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    mx = e.clientX
    my = e.clientY
    if (!visible) {
      root.classList.add('fx-cursor') // hide the native cursor only once ours is actually running
      gsap.set([dot, ring], { x: mx, y: my })
      trail.forEach((t) => {
        t.x = mx
        t.y = my
      })
    }
    dx(mx)
    dy(my)
    rx(mx)
    ry(my)
    gx?.(mx)
    gy?.(my)
    setVisible(true)
  }

  const INTERACTIVE = 'a[href], button, [role="button"], summary, [data-cursor]'
  const onOver = (e: PointerEvent) => {
    const t = e.target as Element | null
    const isField = !!t?.closest('input, textarea, select')
    const hit = t?.closest<HTMLElement>(INTERACTIVE) ?? null
    const text = hit?.dataset.cursor ?? ''
    label.textContent = text
    cursor.classList.toggle('is-text', isField)
    cursor.classList.toggle('is-link', !!hit && !isField)
    cursor.classList.toggle('has-label', !!text && !isField)
    cursor.classList.toggle('is-copy', !hit && !isField && !!t?.closest('p, h1, h2, h3, li, blockquote'))
  }
  const onDown = (e: PointerEvent) => {
    cursor.classList.add('is-down')
    if (e.pointerType !== 'mouse') return
    const r = document.createElement('span')
    r.className = 'cursor-ripple'
    cursor.appendChild(r)
    gsap.set(r, { x: e.clientX, y: e.clientY, xPercent: -50, yPercent: -50 })
    gsap.fromTo(r, { scale: 0.2, opacity: 0.9 }, { scale: 2.6, opacity: 0, duration: 0.75, ease: 'power2.out', onComplete: () => r.remove() })
  }
  const onUp = () => cursor.classList.remove('is-down')
  const onLeaveDoc = () => setVisible(false)

  window.addEventListener('pointermove', onMove, { passive: true })
  root.addEventListener('pointerover', onOver, { passive: true })
  window.addEventListener('pointerdown', onDown, { passive: true })
  window.addEventListener('pointerup', onUp, { passive: true })
  document.documentElement.addEventListener('mouseleave', onLeaveDoc)

  return () => {
    window.removeEventListener('pointermove', onMove)
    root.removeEventListener('pointerover', onOver)
    window.removeEventListener('pointerdown', onDown)
    window.removeEventListener('pointerup', onUp)
    document.documentElement.removeEventListener('mouseleave', onLeaveDoc)
    gsap.ticker.remove(tick)
    trail.forEach((t) => t.el.remove())
    root.classList.remove('fx-cursor')
    cursor.classList.remove('is-visible', 'is-link', 'is-text', 'has-label', 'is-down', 'is-copy')
    gsap.killTweensOf([dot, ring, glow].filter(Boolean))
  }
}

/* -------------------------------------------------------------------------- */
/* Hover word-lift, spotlight, depth parallax, marquee                         */
/* -------------------------------------------------------------------------- */

/** Splits copy into words so each word lifts and turns gold on hover. Returns a disposer. */
export function hoverWords(el: HTMLElement): () => void {
  if (el.dataset.hw) return () => undefined
  el.dataset.hw = '1'
  const split = SplitText.create(el, { type: 'words', wordsClass: 'hw' })
  return () => {
    split.revert()
    delete el.dataset.hw
  }
}

/** Soft gold light that follows the pointer inside a card (writes two CSS variables on that card only). */
export function spotlight(el: HTMLElement): () => void {
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  el.addEventListener('pointermove', move, { passive: true })
  return () => el.removeEventListener('pointermove', move)
}

/** Elements with data-depth drift against the pointer for a sense of depth. */
export function depthParallax(zone: HTMLElement, items: HTMLElement[], strength = 34): () => void {
  const tos = items.map((el) => ({
    x: gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3' }),
    y: gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power3' }),
    d: Number(el.dataset.depth ?? 1),
  }))
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const nx = e.clientX / window.innerWidth - 0.5
    const ny = e.clientY / window.innerHeight - 0.5
    tos.forEach((t) => {
      t.x(-nx * strength * t.d)
      t.y(-ny * strength * t.d)
    })
  }
  const onLeave = () => tos.forEach((t) => {
    t.x(0)
    t.y(0)
  })
  zone.addEventListener('pointermove', onMove, { passive: true })
  zone.addEventListener('pointerleave', onLeave, { passive: true })
  return () => {
    zone.removeEventListener('pointermove', onMove)
    zone.removeEventListener('pointerleave', onLeave)
    gsap.killTweensOf(items)
    gsap.set(items, { clearProps: 'x,y' })
  }
}

/** Infinite ticker that speeds up with scroll and reverses direction when the visitor scrolls up. */
export function marquee(track: HTMLElement, duration = 30): () => void {
  const tween = gsap.to(track, { xPercent: -50, duration, ease: 'none', repeat: -1 })
  let dir = 1
  let boost = 0
  const st = ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      dir = self.direction === 1 ? 1 : -1
      boost = Math.min(Math.abs(self.getVelocity()) / 500, 5)
    },
  })
  const tick = () => {
    boost *= 0.94
    const target = dir * (1 + boost)
    tween.timeScale(tween.timeScale() + (target - tween.timeScale()) * 0.1)
  }
  gsap.ticker.add(tick)
  return () => {
    gsap.ticker.remove(tick)
    st.kill()
    tween.kill()
    gsap.set(track, { clearProps: 'transform' })
  }
}
