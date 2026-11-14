import { useRef } from 'react'
import { gsap, useGSAP } from '../motion/registry'
import { prefersReducedMotion } from '../motion/env'

/** [x, width, height] of each tower in a 1440 x 360 skyline. */
const TOWERS: Array<[number, number, number]> = [
  [40, 90, 170],
  [150, 70, 240],
  [240, 110, 130],
  [370, 80, 290],
  [470, 100, 190],
  [590, 70, 150],
  [680, 120, 260],
  [820, 80, 200],
  [920, 100, 310],
  [1040, 90, 160],
  [1150, 110, 230],
  [1280, 80, 180],
]

function windows(x: number, w: number, h: number): string {
  const rows = Math.floor((h - 34) / 26)
  const cols = Math.floor((w - 16) / 22)
  let d = ''
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      d += `M${x + 10 + c * 22} ${360 - h + 24 + r * 26}h8 `
    }
  }
  return d
}

/**
 * Fixed backdrop behind every dark section: a blueprint grid that drifts, a warm light that
 * travels down the page, and a real-estate skyline that grows tower by tower as you scroll.
 * Light sections are opaque and simply cover it.
 */
export function ScrollBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = ref.current
      if (!root || prefersReducedMotion()) return
      const range = { start: 0, end: 'max' }
      gsap.to(root.querySelector('.bg-grid'), { yPercent: -9, ease: 'none', scrollTrigger: { ...range, scrub: true } })
      gsap.fromTo(
        root.querySelector('.bg-glow'),
        { xPercent: -25, yPercent: -30 },
        { xPercent: 35, yPercent: 90, ease: 'none', scrollTrigger: { ...range, scrub: 1.2 } },
      )
      const towers = gsap.utils.toArray<SVGGElement>('.bld', root)
      gsap.set(towers, { transformOrigin: '50% 100%' })
      gsap.fromTo(
        towers,
        { scaleY: 0.3 },
        { scaleY: 1, ease: 'none', stagger: { each: 0.05, from: 'random' }, scrollTrigger: { ...range, scrub: 0.9 } },
      )
    },
    { scope: ref },
  )

  return (
    <div className="bg-fx" ref={ref} aria-hidden="true">
      <div className="bg-grid" />
      <div className="bg-glow" />
      <svg className="bg-skyline" viewBox="0 0 1440 360" preserveAspectRatio="xMidYMax slice">
        {TOWERS.map(([x, w, h]) => (
          <g className="bld" key={x}>
            <rect x={x} y={360 - h} width={w} height={h} />
            <line x1={x + w / 2} y1={360 - h} x2={x + w / 2} y2={360 - h - 14} />
            <path d={windows(x, w, h)} />
          </g>
        ))}
        <line className="bg-ground" x1="0" y1="359" x2="1440" y2="359" />
      </svg>
    </div>
  )
}
