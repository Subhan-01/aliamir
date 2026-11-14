import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../motion/registry'
import { prefersReducedMotion } from '../motion/env'

/**
 * A small golden guide-bot that rides a rail down the page as you scroll.
 * Its eyes look the way you scroll (down / up), it squints when you scroll fast,
 * the gold line fills behind it, and the rail's dots are the page's own sections
 * (labels are the sections' real headings). Click a dot to glide to that section.
 * Desktop only; not rendered for reduced-motion users.
 */
export function ScrollGuide() {
  const ref = useRef<HTMLElement>(null)
  const sections = useRef<HTMLElement[]>([])
  const [labels, setLabels] = useState<string[]>([])

  // collect this page's sections + their headings once the page is mounted
  useEffect(() => {
    if (prefersReducedMotion() || window.innerWidth < 1100) return
    const main = ref.current?.closest('main')
    if (!main) return
    const found: HTMLElement[] = []
    const texts: string[] = []
    Array.from(main.children).forEach((child) => {
      if (!(child instanceof HTMLElement)) return
      if (child.tagName !== 'SECTION' && child.tagName !== 'FOOTER') return
      const heading = child.querySelector('h1, h2, h3')
      const text = heading?.textContent?.replace(/\s+/g, ' ').trim()
      if (text) {
        found.push(child)
        texts.push(text)
      }
    })
    sections.current = found
    setLabels(texts)
  }, [])

  useGSAP(
    () => {
      const root = ref.current
      if (!root || !labels.length) return
      const track = root.querySelector<HTMLElement>('.sg-track')
      const fill = root.querySelector<HTMLElement>('.sg-fill')
      const bot = root.querySelector<HTMLElement>('.sg-bot')
      const bubble = root.querySelector<HTMLElement>('.sg-bubble')
      const nodes = Array.from(root.querySelectorAll<HTMLElement>('.sg-node'))
      if (!track || !fill || !bot || !bubble) return

      const pos: number[] = labels.map(() => 0)
      // place each dot where its section is centred in the viewport (as a share of the scroll range)
      const layout = () => {
        const vh = window.innerHeight
        const max = Math.max(1, document.documentElement.scrollHeight - vh)
        sections.current.forEach((sec, i) => {
          const r = sec.getBoundingClientRect()
          const centre = r.top + window.scrollY + r.height / 2
          const p = Math.min(1, Math.max(0, (centre - vh / 2) / max))
          pos[i] = p
          if (nodes[i]) nodes[i].style.top = `${p * 100}%`
        })
      }
      layout()
      ScrollTrigger.addEventListener('refresh', layout)

      const setY = gsap.quickTo(bot, 'y', { duration: 0.55, ease: 'power3' })
      const setFill = gsap.quickTo(fill, 'scaleY', { duration: 0.55, ease: 'power3' })
      let active = -1

      const apply = (self: ScrollTrigger) => {
        const p = self.progress
        setY(p * track.clientHeight)
        setFill(p)
        bot.dataset.dir = self.direction === 1 ? 'down' : 'up'
        bot.classList.toggle('is-fast', Math.abs(self.getVelocity()) > 1800)
        bot.classList.toggle('is-done', p > 0.985)
        let best = 0
        let bestDist = Infinity
        pos.forEach((q, i) => {
          const d = Math.abs(q - p)
          if (d < bestDist) {
            bestDist = d
            best = i
          }
        })
        if (best !== active) {
          active = best
          nodes.forEach((n, i) => n.classList.toggle('is-active', i === best))
          bubble.textContent = labels[best] ?? ''
          bubble.classList.remove('pop')
          void bubble.offsetWidth // restart the pop animation
          bubble.classList.add('pop')
        }
      }
      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: apply, onRefresh: apply })

      return () => ScrollTrigger.removeEventListener('refresh', layout)
    },
    { scope: ref, dependencies: [labels], revertOnUpdate: true },
  )

  const go = (i: number) => {
    const target = sections.current[i]
    if (target) gsap.to(window, { scrollTo: { y: target, autoKill: true }, duration: 1.4, ease: 'power3.inOut' })
  }

  return (
    <aside className="scroll-guide" ref={ref} aria-label="Page sections" data-ready={labels.length ? 'true' : 'false'}>
      <div className="sg-track">
        <span className="sg-fill" />
      </div>
      <ul className="sg-nodes">
        {labels.map((label, i) => (
          <li className="sg-node" key={`${label}-${i}`}>
            <button type="button" onClick={() => go(i)} aria-label={`Go to: ${label}`}>
              <span className="sg-dot" />
              <span className="sg-label">{label}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="sg-bot" data-dir="down" aria-hidden="true">
        <span className="sg-bubble" />
        <svg viewBox="0 0 40 46" width="38" height="44">
          <line className="sg-ant-line" x1="20" y1="2" x2="20" y2="9" />
          <circle className="sg-ant" cx="20" cy="3" r="2.4" />
          <rect className="sg-head" x="5" y="9" width="30" height="26" rx="9" />
          <g className="sg-eyes">
            <g className="sg-blink">
              <circle className="sg-eye" cx="14" cy="21" r="3" />
              <circle className="sg-eye" cx="26" cy="21" r="3" />
            </g>
          </g>
          <path className="sg-mouth" d="M15 29 Q20 32 25 29" />
          <rect className="sg-neck" x="15" y="36" width="10" height="5" rx="2" />
        </svg>
      </div>
    </aside>
  )
}
