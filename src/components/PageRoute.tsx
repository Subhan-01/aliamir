import { useEffect, useRef } from 'react'
import { ScrollTrigger } from '../motion/registry'
import { prefersReducedMotion } from '../motion/env'

/**
 * A golden route that runs down the margins of the whole page and swoops across the page between
 * sections, with a small house marker that rides it as you scroll (down or up). The line is drawn
 * up to the marker and a faint ghost of the full route shows where it is heading. Desktop only.
 */
export function PageRoute() {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = ref.current
    const main = svg?.closest('main') as HTMLElement | null
    if (!svg || !main || prefersReducedMotion() || window.innerWidth < 1100) return
    const path = svg.querySelector<SVGPathElement>('.route-path')
    const ghost = svg.querySelector<SVGPathElement>('.route-ghost')
    const marker = svg.querySelector<SVGGElement>('.route-marker')
    if (!path || !ghost || !marker) return

    let len = 0
    let mainTop = 0

    const build = () => {
      const W = main.clientWidth
      const H = main.offsetHeight
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
      svg.style.height = `${H}px`
      mainTop = main.getBoundingClientRect().top + window.scrollY

      const sections = Array.from(main.children).filter(
        (c): c is HTMLElement => c instanceof HTMLElement && (c.tagName === 'SECTION' || c.tagName === 'FOOTER') && c.offsetHeight > 320,
      )
      const xL = 20
      const xR = W - 20
      let d = ''
      let px = 0
      let py = 0
      sections.forEach((s, i) => {
        const x = i % 2 === 0 ? xL : xR
        const top = s.offsetTop + 90
        const bottom = s.offsetTop + s.offsetHeight - 90
        if (bottom <= top) return
        if (!d) {
          d = `M ${x} ${top}`
        } else {
          const k = (top - py) * 0.55
          d += ` C ${px} ${py + k} ${x} ${top - k} ${x} ${top}`
        }
        d += ` L ${x} ${bottom}`
        px = x
        py = bottom
      })
      ghost.setAttribute('d', d)
      path.setAttribute('d', d)
      len = d ? path.getTotalLength() : 0
      path.style.strokeDasharray = `${len}`
      update()
    }

    // find the point of the route that sits ~55% down the viewport, so the marker is always on screen
    const update = () => {
      if (!len) return
      const target = window.scrollY + window.innerHeight * 0.55 - mainTop
      let lo = 0
      let hi = len
      for (let i = 0; i < 16; i++) {
        const mid = (lo + hi) / 2
        if (path.getPointAtLength(mid).y < target) lo = mid
        else hi = mid
      }
      const p = path.getPointAtLength(lo)
      path.style.strokeDashoffset = `${len - lo}`
      marker.setAttribute('transform', `translate(${p.x} ${p.y})`)
    }

    const st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: update })
    ScrollTrigger.addEventListener('refresh', build)
    const ro = new ResizeObserver(build)
    ro.observe(main)
    const timer = window.setTimeout(build, 120)
    build()

    return () => {
      window.clearTimeout(timer)
      st.kill()
      ScrollTrigger.removeEventListener('refresh', build)
      ro.disconnect()
    }
  }, [])

  return (
    <svg className="page-route" ref={ref} aria-hidden="true" preserveAspectRatio="none">
      <path className="route-ghost" />
      <path className="route-path" />
      <g className="route-marker">
        <circle r="16" />
        <path d="M-7 1 L0 -6 L7 1 M-5 0 V7 H5 V0 M-1.5 7 V3 H1.5 V7" />
      </g>
    </svg>
  )
}
