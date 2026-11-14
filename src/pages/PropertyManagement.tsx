import { Mail, MessageCircle } from 'lucide-react'
import { PageShell, PageHero } from '../components/Layout'
import { PM_EMAIL, WA_PM } from '../content/site'

const HANDLE = [
  { title: 'Maintenance & Repairs', text: 'Plumbing, electrical work, AC installation & servicing, leakages, fittings, and fixtures.' },
  { title: 'Renovation & Upgrades', text: 'Interior improvements, remodelling, painting & finishing, flooring & false ceiling work.' },
  { title: 'Construction Services', text: 'Grey structure to full finishing, complete house construction, structural and design execution.' },
  { title: 'Specialised Works', text: 'Carpentry & woodwork, aluminium & glass work, waterproofing, solar solutions, core cutting.' },
  { title: 'External & Utility Services', text: 'Pavement & gardening, deep cleaning & pest control, water systems & boring, general upkeep.' },
  { title: 'Rental Management', text: 'Tenant coordination, property supervision, rent collection, and complete rental operations.' },
]

const WHY = [
  { title: 'Trusted Name', text: 'Built on 7+ years of real estate advisory reputation' },
  { title: 'Remote Friendly', text: '100% managed remotely — ideal for overseas Pakistanis' },
  { title: 'No Hidden Costs', text: 'Full expense transparency before any work begins' },
  { title: 'Progress Updates', text: 'Before & after visuals and regular phase reports' },
  { title: 'One Point of Contact', text: 'Direct communication with the team at every stage' },
  { title: 'Full Scope', text: 'From a leaking tap to complete house construction' },
]

function Actions({ reveal = false }: { reveal?: boolean }) {
  return (
    <div className={reveal ? 'hero-actions reveal' : 'hero-actions'} data-hero={reveal ? undefined : 'actions'}>
      <a className="button button-gold" href={WA_PM.href} target="_blank" rel="noreferrer" data-cursor="Chat">
        <MessageCircle size={15} /> WhatsApp: {WA_PM.number}
      </a>
      <a className="button button-quiet" href={`mailto:${PM_EMAIL}`} data-cursor="Email">
        <Mail size={15} /> Email Us
      </a>
    </div>
  )
}

export default function PropertyManagement() {
  return (
    <PageShell title="Property Management by Ali Amir | Construction, Renovation & Maintenance Pakistan">
      <PageHero
        title={
          <>
            Property Management <em>by Ali Amir</em>
          </>
        }
        sub="Your complete property execution partner — from minor fixes to full construction. Backed by 7+ years of real estate trust, managed with complete transparency."
      >
        <Actions />
        <p className="page-hero-body" data-hero="body">
          After 7+ years of guiding clients in property investment and consultancy through <strong>Property Advices by Ali Amir</strong>, this
          sister company was established to handle the <em>execution side</em> — managing, maintaining, upgrading, and developing properties so
          owners retain full control without needing to be physically present.
        </p>
      </PageHero>

      <section className="block section-light">
        <div className="section-wrap">
          <div className="block-head">
            <h2 data-split="heading">
              What We <em>Handle</em>
            </h2>
            <p className="block-sub reveal">End-to-end property services under one roof</p>
          </div>
          <div className="info-grid">
            {HANDLE.map((h) => (
              <article className="info-card reveal" key={h.title}>
                <h3>{h.title}</h3>
                <p>{h.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-band section-dark">
        <div className="section-wrap">
          <div className="stats-row">
            <div className="stat-item reveal">
              <div className="stat-number">
                <span data-count="7" data-suffix="+">7+</span>
              </div>
              <p>Years of real estate trust behind this venture</p>
            </div>
            <div className="stat-item reveal">
              <div className="stat-number">
                <span data-count="4">4</span>
              </div>
              <p>Phase transparency reporting on every project</p>
            </div>
            <div className="stat-item reveal">
              <div className="stat-number">
                <span data-count="100" data-suffix="%">100%</span>
              </div>
              <p>Remote management capability for overseas clients</p>
            </div>
            <div className="stat-item reveal">
              <div className="stat-number">
                <span data-stat-static>0</span>
              </div>
              <p>Hidden costs — all expenses communicated upfront</p>
            </div>
          </div>
        </div>
      </section>

      <section className="block section-dark" data-rise>
        <div className="section-wrap">
          <div className="pricing">
            <div>
              <h2 className="sub-h2" data-split="heading">
                Transparent Pricing Model
              </h2>
              <p className="body-copy light reveal">
                All services are quoted based on project scope. A <strong>30% service charge</strong> covers project management, supervision,
                execution handling, coordination, client communication, and quality assurance — ensuring a smooth, reliable, and stress-free
                experience.
              </p>
            </div>
            <div>
              <blockquote className="quote-xl quote-sm">
                <p data-split="quote">
                  "Before & after visuals. Work progress updates. Expense breakdowns. Direct communication. Complete clarity at every phase."
                </p>
              </blockquote>
              <Actions reveal />
            </div>
          </div>
        </div>
      </section>

      <section className="block section-light">
        <div className="section-wrap">
          <div className="block-head">
            <h2 data-split="heading">
              Why Choose <em>Us</em>
            </h2>
            <p className="block-sub reveal">Property management done with the same integrity as our advisory work</p>
          </div>
          <div className="info-grid">
            {WHY.map((w) => (
              <article className="info-card reveal" key={w.title}>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  )
}

