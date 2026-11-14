import type { CSSProperties } from 'react'

export interface StackItem {
  title: string
  items: string[]
}

/**
 * Sticky stacking cards: each card pins near the top and the next one slides over it,
 * while the covered card shrinks and dims (animation lives in usePageMotion).
 */
export function StackCards({ items, light = false }: { items: StackItem[]; light?: boolean }) {
  return (
    <div className={light ? 'stack stack-light' : 'stack'} data-stack>
      {items.map((card, i) => (
        <article className="stack-card" key={card.title} style={{ '--i': i } as CSSProperties}>
          <div className="stack-in">
            <span className="stack-num">{String(i + 1).padStart(2, '0')}</span>
            <h3>{card.title}</h3>
            <div className="list-col stack-list">
              <ul>
                {card.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <span className="stack-dim" aria-hidden="true" />
          </div>
        </article>
      ))}
    </div>
  )
}
