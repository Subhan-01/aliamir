import { Link } from 'react-router-dom'
import { ArrowUpRight, Check } from 'lucide-react'
import { PageShell, PageHero } from '../components/Layout'
import { IMG } from '../content/site'

const ROLES = [
  'Founder & Managing Director — Property Advices by Ali Amir',
  'Real Estate Educationalist',
  'Real Estate Consultant & Advisor',
  'Real Estate Influencer',
]

const EDUCATION = [
  {
    title: 'Academic Qualifications',
    items: [
      'Diploma in Real Estate Law & Taxation',
      'Shariah Education (In Progress)',
      'Graduation (In Progress)',
      'Digital Marketing Certification — NED University',
    ],
  },
  { title: 'Additional Training & Skills', items: ['Public Speaking', 'Business Communication', 'Sales & Marketing Skills', 'English Language'] },
  {
    title: 'Content Creation',
    items: ['Educational real estate videos', 'Investment guidance content', 'Market awareness content', 'Project reviews and walkthroughs'],
  },
]

export default function About() {
  return (
    <PageShell title="About Ali Amir | Real Estate Consultant & Influencer Pakistan">
      <PageHero
        title={
          <>
            About <em>Ali Amir</em>
          </>
        }
        sub="A recognized and trusted name in Pakistan's real estate sector"
      />

      <section className="block section-light">
        <div className="section-wrap">
          <div className="about-grid">
            <div className="about-image-wrap reveal">
              <div className="about-image-frame" data-mask-img>
                <span className="img-zoom">
                  <img src={IMG.about} alt="Ali Amir — Real Estate Professional Pakistan" loading="lazy" decoding="async" />
                </span>
              </div>
            </div>
            <div className="about-copy">
              <h2 className="sub-h2" data-split="heading">
                Professional Roles
              </h2>
              <p className="body-copy reveal">
                Ali Amir is a Pakistani real estate professional who educates people, guides investors, and actively works in the market with
                builders, developers, and clients to help them make confident and informed decisions.
              </p>
              <p className="body-copy reveal">
                He is known for his educational content, market insight, and strong on-ground experience in Pakistan's real estate market.
              </p>
              <div className="role-list rule-top reveal">
                {ROLES.map((r) => (
                  <div key={r}>
                    <Check size={15} />
                    {r}
                  </div>
                ))}
              </div>
              <blockquote className="about-quote">
                <p data-split="quote">"Real estate must be understood before investment, and trust must come before transactions."</p>
              </blockquote>
              <p className="body-copy reveal">
                Ali Amir believes that real estate should be approached with knowledge and clarity. His mission is to spread awareness,
                transparency, and correct knowledge in an industry where misinformation often causes significant financial loss. He aims to make
                real estate simpler, safer, and more human for every buyer, investor, and overseas Pakistani.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="block section-dark" data-rise>
        <div className="section-wrap">
          <div className="block-head">
            <h2 data-split="heading">Gallery</h2>
            <p className="block-sub reveal">Ali Amir in the field — meetings, site visits, and client sessions</p>
          </div>
          <div className="gallery">
            {IMG.gallery.map((g) => (
              <figure className="gallery-item" key={g.src} data-mask-img>
                <span className="img-zoom">
                  <img src={g.src} alt={g.alt} loading="lazy" decoding="async" />
                </span>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="block section-light">
        <div className="section-wrap">
          <div className="block-head">
            <h2 data-split="heading">
              Education & <em>Professional Background</em>
            </h2>
            <p className="block-sub reveal">Built on learning first, practising in the field, and continuously improving</p>
          </div>
          <div className="list-grid">
            {EDUCATION.map((col) => (
              <div className="list-col reveal" key={col.title}>
                <h3>{col.title}</h3>
                <ul>
                  {col.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="large-copy dark closing-copy" data-split="chars">
            This combination of education and practical exposure enables Ali Amir to explain complex real estate matters in a simple, clear, and
            practical way — helping first-time buyers, investors, overseas Pakistanis, and real estate learners understand market realities.
          </p>
        </div>
      </section>

      <section className="block section-dark cta-band">
        <div className="section-wrap">
          <h2 data-split="heading">Ready to talk real estate?</h2>
          <p className="block-sub reveal">Get a free, no-obligation consultation directly with Ali Amir.</p>
          <Link className="button button-gold reveal" to="/contact" data-cursor="Book">
            Get Free Consultation <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
