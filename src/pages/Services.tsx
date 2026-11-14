import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { PageShell, PageHero } from '../components/Layout'
import { StackCards } from '../components/StackCards'

const CORE = [
  {
    title: 'Real Estate Marketing',
    items: [
      'Builder & developer project marketing',
      'Professional video promotions',
      'Digital real estate campaigns',
      'Market research and project analysis',
      'Social media presence management',
    ],
  },
  {
    title: 'Advisory & Consultation',
    items: [
      'Free-of-cost real estate consultation',
      'Property guidance & investment advice',
      'Documentation review & basic verification',
      'Market research support',
      'Project safety assessment',
    ],
  },
  {
    title: 'Sales & Purchase',
    items: ['Property buying assistance', 'Property selling assistance', 'Investor facilitation', 'Ethical deal execution', 'Overseas Pakistani support'],
  },
]

const SERVE = [
  { title: 'First-Time Buyers', text: 'Step-by-step guidance so you never feel lost or pressured' },
  { title: 'Investors', text: 'Data-backed market insight to maximise returns and minimise risk' },
  { title: 'Builders & Developers', text: 'Ethical project marketing that builds lasting credibility' },
  { title: 'Overseas Pakistanis', text: 'Trusted remote advisory and verified on-ground support' },
  { title: 'Property Sellers', text: 'Strategic positioning and wide-reach to achieve the best outcome' },
  { title: 'Real Estate Learners', text: 'Educational content and direct access to expert knowledge' },
]

export default function Services() {
  return (
    <PageShell title="Services | Property Advices by Ali Amir — Real Estate Marketing & Advisory">
      <PageHero
        title={
          <>
            Property Advices <em>by Ali Amir</em>
          </>
        }
        sub="A professional Real Estate Marketing & Advisory firm — guidance before profit"
      >
        <p className="page-hero-body" data-hero="body">
          Property Advices by Ali Amir provides free-of-cost consultation to help people avoid risky and misleading projects, choose the right
          locations, decide the right timing for investment, and protect their hard-earned money. Every service is built on a simple principle:
        </p>
        <blockquote className="hero-quote" data-hero="quote">
          "Guidance should come before profit."
        </blockquote>
      </PageHero>

      <section className="block section-light">
        <div className="section-wrap">
          <div className="block-head">
            <h2 data-split="heading">
              Core <em>Services</em>
            </h2>
            <p className="block-sub reveal">Tailored support for buyers, investors, builders, and developers</p>
          </div>
          <StackCards items={CORE} light />
        </div>
      </section>

      <section className="block section-dark" data-rise>
        <div className="section-wrap">
          <div className="block-head">
            <h2 data-split="heading">
              Who We <em>Serve</em>
            </h2>
            <p className="block-sub reveal">Every client is treated with equal care and transparency</p>
          </div>
          <div className="info-grid">
            {SERVE.map((s) => (
              <article className="info-card reveal" key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block section-light cta-band">
        <div className="section-wrap">
          <p className="eyebrow reveal">
            <span className="eyebrow-dot" />
            Property Management
          </p>
          <h2 data-split="heading">Need Full Property Execution?</h2>
          <p className="block-sub reveal">
            Property Management by Ali Amir handles maintenance, renovation, construction, and rental management — everything after the advisory
            stage.
          </p>
          <Link className="button button-dark reveal" to="/property-management" data-cursor="View">
            Property Management Services <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
