import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { PageShell, PageHero } from '../components/Layout'

const MISSION = [
  'Educate people about real estate realities',
  'Protect buyers from unsafe and misleading investments',
  'Promote ethical and transparent marketing practices',
  'Support builders and developers with transparent promotion',
  'Encourage informed investment decisions',
  'Make real estate simpler, safer, and more human',
]

const VALUES = [
  { title: 'Transparency', text: 'Every deal, every consultation, every recommendation — communicated with full clarity' },
  { title: 'Education First', text: 'Informing people before guiding them — knowledge protects better than any contract' },
  { title: 'Ethics', text: 'No misleading promotions, no hidden agendas — integrity in every professional relationship' },
  { title: 'Responsibility', text: "Accountable for every piece of advice — because people's savings depend on it" },
  { title: 'Empowerment', text: 'Helping clients develop the knowledge to make independent, confident decisions' },
  { title: 'Service', text: "Guidance before profit — always putting the client's best interest first" },
]

export default function Vision() {
  return (
    <PageShell title="Vision & Mission | Ali Amir — Building a Trusted Real Estate Ecosystem in Pakistan">
      <PageHero
        title={
          <>
            Vision & <em>Mission</em>
          </>
        }
        sub="Building a trusted real estate ecosystem in Pakistan"
      />

      <section className="block section-light">
        <div className="section-wrap">
          <div className="vm-grid">
            <div>
              <h2 className="sub-h2" data-split="heading">
                Vision
              </h2>
              <p className="large-copy dark reveal">
                To build a trusted real estate ecosystem where people invest with knowledge, clarity, and confidence — not fear.
              </p>
              <p className="body-copy reveal">
                Ali Amir aims to contribute towards a future where no family is forced to live without shelter, where home ownership becomes
                achievable rather than just a dream, and where real estate decisions are made with knowledge instead of pressure.
              </p>
              <p className="body-copy accent-note reveal">
                <em>For Ali Amir, a home is not just a structure — it is safety, dignity, stability, and emotional security.</em>
              </p>
            </div>
            <div>
              <h2 className="sub-h2" data-split="heading">
                Mission
              </h2>
              <ul className="mission-list rule-top reveal">
                {MISSION.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
              <p className="body-copy accent-note reveal">
                <em>Ali Amir believes that correct information can change lives, and real estate education plays a key role in shaping a stable society.</em>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="block section-dark" data-rise>
        <div className="section-wrap">
          <div className="block-head">
            <h2 data-split="heading">
              Core <em>Values</em>
            </h2>
            <p className="block-sub reveal">The principles that guide every decision and interaction</p>
          </div>
          <div className="info-grid">
            {VALUES.map((v) => (
              <article className="info-card reveal" key={v.title}>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block section-dark belief">
        <div className="section-wrap">
          <div className="block-head">
            <h2 data-split="heading">
              The Belief <em>Behind the Work</em>
            </h2>
          </div>
          <blockquote className="quote-xl">
            <p data-split="story">"If people understand real estate properly, they will never be exploited."</p>
          </blockquote>
          <blockquote className="quote-xl quote-gap-top">
            <p data-split="story">
              "Real estate is not just land and buildings — it is about right information, right timing, and a secure future."
            </p>
          </blockquote>
          <p className="belief-note reveal">AliAmir.com represents a name built on learning, a company built on trust, and a vision built on responsibility.</p>
        </div>
      </section>

      <section className="block section-light cta-band">
        <div className="section-wrap">
          <h2 data-split="heading">Share the Vision</h2>
          <p className="block-sub reveal">
            Whether you are a buyer, investor, or someone who simply wants to learn — Ali Amir is ready to help.
          </p>
          <div className="hero-actions center reveal">
            <Link className="button button-dark" to="/contact" data-cursor="Book">
              Get Free Consultation <ArrowUpRight size={15} />
            </Link>
            <Link className="button button-quiet button-quiet-dark" to="/services" data-cursor="View">
              Our Services <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
