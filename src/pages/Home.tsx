import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Award, BadgeCheck, Briefcase, Check, Compass, GraduationCap, Megaphone } from 'lucide-react'
import { PageShell } from '../components/Layout'
import { StackCards } from '../components/StackCards'
import { IMG } from '../content/site'

const ROLES = [
  'Founder & Managing Director of Property Advices by Ali Amir',
  'Real Estate Educationalist',
  'Real Estate Consultant & Advisor',
  'Real Estate Influencer',
]

/** Route of the golden line: it leaves from behind the portrait and links every icon. */
const ROUTE =
  'M -30 70 C 100 90, 300 200, 445 190 C 470 130, 460 80, 430 45 C 300 100, 100 300, -35 360 C -20 450, 120 520, 330 520 C 400 480, 430 400, 415 330 C 300 260, 100 120, -30 70'

const NODES = [
  { cls: 'n-exp', depth: 1.2, Icon: Award, label: '7+ Years of Real Estate Experience' },
  { cls: 'n-advisor', depth: 0.8, Icon: Compass, label: 'Real Estate Advisor' },
  { cls: 'n-edu', depth: 1.5, Icon: GraduationCap, label: 'Real Estate Educationalist' },
  { cls: 'n-inf', depth: 1, Icon: Megaphone, label: 'Real Estate Influencer' },
  { cls: 'n-con', depth: 1.3, Icon: Briefcase, label: 'Real Estate Consultant' },
  { cls: 'n-free', depth: 0.9, Icon: BadgeCheck, label: '100% Free Initial Consultation' },
]

const PHRASES = [
  'Real Estate Educationalist',
  'Consultant',
  'Advisor',
  'Influencer',
  'Guidance should come before profit',
  '100% Free Initial Consultation',
]

const FIRM = [
  {
    title: 'Real Estate Marketing',
    items: ['Builder & developer project marketing', 'Professional video promotions', 'Digital real estate campaigns', 'Market research and project analysis'],
  },
  {
    title: 'Advisory & Consultation',
    items: [
      'Free-of-cost real estate consultation',
      'Property guidance & investment advice',
      'Documentation review & basic verification',
      'Market research support',
    ],
  },
  {
    title: 'Sales & Purchase',
    items: ['Property buying assistance', 'Property selling assistance', 'Investor facilitation', 'Ethical deal execution'],
  },
]

const TRUST = [
  { title: 'Educational Foundation', text: 'Strong academic background in real estate, law, and marketing' },
  { title: 'Field Experience', text: "Active on-ground presence in Pakistan's real estate market" },
  { title: 'Honest Advice', text: 'Practical guidance focused on client protection' },
  { title: 'Free Consultation', text: 'Guidance before profit — always' },
  { title: 'Transparent Dealing', text: 'Ethical and clear business practices' },
  { title: 'Market Presence', text: 'Active content creation and real estate education' },
]

export default function Home() {
  return (
    <PageShell title="Ali Amir | Real Estate Educationalist & Advisor — Pakistan">
      <section className="home-hero section-dark">
        <div className="section-wrap">
          <div className="home-hero-grid">
            <div className="home-hero-copy">
              <p className="eyebrow" data-hero="kicker">
                <span className="eyebrow-dot" />
                Real Estate Educationalist | Consultant | Advisor | Influencer
              </p>
              <h1 className="hero-h1" data-hero="title">
                Ali <em>Amir</em>
              </h1>
              <p className="hero-quote" data-hero="quote">
                "Real estate is not just land and buildings — it is about right information, right timing, and a secure future."
              </p>
              <p className="hero-lead" data-hero="lead">
                Ali Amir is a Pakistani real estate professional who educates people, guides investors, and actively works in the market with
                builders, developers, and clients to help them make confident and informed real estate decisions.
              </p>
              <div className="hero-actions" data-hero="actions">
                <Link className="button button-gold" to="/contact" data-cursor="Book">
                  Free Consultation <ArrowUpRight size={15} />
                </Link>
                <Link className="button button-quiet" to="/about" data-cursor="Explore">
                  Learn More <ArrowRight size={15} />
                </Link>
              </div>
            </div>
            <div className="home-art-wrap">
              <svg className="hero-line" data-hero="line" viewBox="0 0 400 500" aria-hidden="true">
                <path className="hero-path" pathLength={1} d={ROUTE} />
                <circle className="hero-spark" r="4.5">
                  <animateMotion dur="12s" repeatCount="indefinite" path={ROUTE} />
                </circle>
              </svg>
              <div className="home-art" data-hero="art">
                <div className="home-art-frame">
                  <img className="home-art-image" src={IMG.hero} alt="Ali Amir — Real Estate Professional Pakistan" width={900} height={1125} />
                </div>
              </div>
              <div className="hero-chips" data-hero="chips">
                {NODES.map(({ cls, depth, Icon, label }) => (
                  <div className={`hero-node ${cls}`} data-depth={depth} key={label}>
                    <div className="node-in">
                      <div className="node-float" tabIndex={0} role="img" aria-label={label}>
                        <span className="node-icon">
                          <Icon size={18} />
                        </span>
                        <span className="node-tip">{label}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mq-band section-dark" aria-label="Ali Amir">
        <div className="mq-track" data-marquee>
          {[0, 1].map((k) => (
            <div className="mq-group" key={k} aria-hidden={k === 1 ? 'true' : undefined}>
              {PHRASES.map((p) => (
                <span key={p}>
                  {p}
                  <i className="mq-dot" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="stats-band section-dark">
        <div className="section-wrap">
          <div className="stats-row">
            <div className="stat-item reveal">
              <div className="stat-number">
                <span data-count="7" data-suffix="+">7+</span>
              </div>
              <p>Years of Real Estate Experience</p>
            </div>
            <div className="stat-item reveal">
              <div className="stat-number">
                <span data-count="100" data-suffix="%">100%</span>
              </div>
              <p>Free Initial Consultation</p>
            </div>
            <div className="stat-item reveal">
              <div className="stat-number">
                <span data-count="2">2</span>
              </div>
              <p>Specialist Companies under Ali Amir</p>
            </div>
            <div className="stat-item reveal">
              <div className="stat-number">
                <span data-stat-static>∞</span>
              </div>
              <p>Commitment to Education & Transparency</p>
            </div>
          </div>
        </div>
      </section>

      <section className="block section-light">
        <div className="section-wrap">
          <div className="block-head">
            <h2 data-split="heading">Who Is Ali Amir?</h2>
            <p className="block-sub reveal">A recognized and trusted name in Pakistan's real estate sector</p>
          </div>
          <div className="about-grid">
            <div className="about-image-wrap reveal">
              <div className="about-image-frame" data-mask-img>
                <span className="img-zoom">
                  <img src={IMG.who} alt="Ali Amir — Real Estate Consultant" loading="lazy" decoding="async" />
                </span>
              </div>
            </div>
            <div className="about-copy">
              <h3 className="sub-h3 reveal">Professional Roles</h3>
              <p className="body-copy reveal">
                Ali Amir is known for his educational content, market insight, and strong on-ground experience in Pakistan's real estate
                market. He believes that correct information can change lives.
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
              <Link className="text-link reveal" to="/about">
                Full Profile <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="block section-dark">
        <div className="section-wrap">
          <div className="block-head">
            <h2 data-split="heading">
              Property Advices <em>by Ali Amir</em>
            </h2>
            <p className="block-sub reveal">A professional Real Estate Marketing & Advisory firm</p>
          </div>
          <StackCards items={FIRM} />
          <Link className="text-link block-link reveal" to="/services">
            All Services <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>

      <section className="block section-light">
        <div className="section-wrap">
          <div className="block-head">
            <h2 data-split="heading">
              Why People Trust <em>Ali Amir</em>
            </h2>
          </div>
          <blockquote className="quote-xl quote-gap">
            <p data-split="quote">"If people understand real estate properly, they will never be exploited."</p>
          </blockquote>
          <div className="info-grid">
            {TRUST.map((t) => (
              <article className="info-card reveal" key={t.title}>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </article>
            ))}
          </div>
          <div className="cta-row">
            <blockquote className="quote-xl quote-sm">
              <p data-split="quote">"Guidance should come before profit."</p>
            </blockquote>
            <Link className="button button-dark reveal" to="/contact" data-cursor="Book">
              Start Your Free Consultation <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  )
}

