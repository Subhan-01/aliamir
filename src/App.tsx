import { useEffect, useRef, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Compass,
  Facebook,
  Instagram,
  Menu,
  MessageCircle,
  MoveUpRight,
  Quote,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from 'lucide-react'
import { useAliAmirMotion } from './hooks/useAliAmirMotion'

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const serviceItems = [
  {
    number: '01',
    title: 'Real Estate Consultancy',
    body: 'Professional guidance to understand the real estate market, evaluate opportunities, and make informed property decisions.',
    icon: Compass,
  },
  {
    number: '02',
    title: 'Investment Advisory',
    body: 'Strategic property investment guidance based on market understanding, research, and individual investment objectives.',
    icon: TrendingUp,
  },
  {
    number: '03',
    title: 'Property Sales & Purchase',
    body: 'Professional support throughout property buying and selling, helping clients approach transactions with clarity.',
    icon: ArrowUpRight,
  },
  {
    number: '04',
    title: 'Real Estate Marketing',
    body: 'Strategic digital marketing and promotional solutions for real estate projects, builders, and developers.',
    icon: Sparkles,
  },
  {
    number: '05',
    title: 'Real Estate Education',
    body: 'Making real estate knowledge accessible through educational content, market insights, and practical guidance.',
    icon: BookOpen,
  },
]

const expertiseItems = [
  ['01', 'Market Knowledge', 'Understanding property markets and industry trends.', Compass],
  ['02', 'Investment Guidance', 'Helping clients approach property investment with informed decisions.', TrendingUp],
  ['03', 'Educational Approach', 'Simplifying complex real estate concepts.', BookOpen],
  ['04', 'Transparency', 'Promoting honest communication and clear dealing.', ShieldCheck],
  ['05', 'Strategic Marketing', 'Professional real estate promotional strategies.', Target],
  ['06', 'Client-Centric Service', 'Putting understanding and client needs first.', MessageCircle],
] as const

const marqueeItems = [
  'REAL ESTATE EDUCATION',
  'STRATEGIC ADVISORY',
  'PROPERTY CONSULTANCY',
  'INVESTMENT GUIDANCE',
  'TRANSPARENT DEALING',
]

function App() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showLoader, setShowLoader] = useState(true)
  const [formState, setFormState] = useState({ name: '', phone: '', email: '', message: '' })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formNote, setFormNote] = useState('')

  useAliAmirMotion(rootRef)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 42)
    window.addEventListener('scroll', onScroll, { passive: true })
    const timer = window.setTimeout(() => setShowLoader(false), 3100)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const scrollTo = (href: string) => {
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errors: Record<string, string> = {}
    if (!formState.name.trim()) errors.name = 'Please add your name.'
    if (!formState.phone.trim()) errors.phone = 'Please add a phone number.'
    if (!/^\S+@\S+\.\S+$/.test(formState.email)) errors.email = 'Please add a valid email.'
    if (!formState.message.trim()) errors.message = 'Please share a little context.'
    setFormErrors(errors)
    setFormNote(Object.keys(errors).length ? '' : 'Your details are ready. Connect this form to a backend endpoint to send consultation requests.')
  }

  const updateField = (field: keyof typeof formState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }))
    setFormErrors((current) => ({ ...current, [field]: '' }))
    setFormNote('')
  }

  return (
    <div ref={rootRef} className="site-shell">
      {showLoader && (
        <div className="loader" aria-label="Loading Ali Amir website">
          <div className="loader-inner">
            <p className="loader-kicker">PROPERTY ADVICES BY ALI AMIR</p>
            <div className="loader-logo-wrap"><img className="loader-logo" src="/assets/ali-amir-urdu-logo.png" alt="Ali Amir Urdu logo" /></div>
            <div className="loader-line" />
            <p className="loader-foot">KNOWLEDGE BEFORE INVESTMENT</p>
          </div>
        </div>
      )}

      <div className="scroll-progress" aria-hidden="true" />
      <div className="pointer-glow" aria-hidden="true" />
      <div className="custom-cursor-ring" aria-hidden="true" />
      <div className="custom-cursor-dot" aria-hidden="true" />

      <header className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <a className="brand-lockup" href="#home" onClick={() => scrollTo('#home')} aria-label="Ali Amir home">
          <span className="brand-logo-frame"><img src="/assets/ali-amir-urdu-logo.png" alt="Ali Amir Urdu logo" /></span>
          <span className="brand-wordmark"><strong>ALI AMIR</strong><small>REAL ESTATE ADVISORY</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <a className="nav-cta" href="#contact">Book a consultation <MoveUpRight size={15} /></a>
        <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <div className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-head"><span>MENU / 01</span><span>ALI AMIR</span></div>
        <nav aria-label="Mobile navigation">
          {navItems.map((item, index) => (
            <a key={item.href} href={item.href} onClick={() => scrollTo(item.href)}><span>0{index + 1}</span>{item.label}<ArrowUpRight size={18} /></a>
          ))}
        </nav>
        <a className="button button-gold mobile-menu-cta" href="#contact" onClick={() => scrollTo('#contact')}>Start a conversation <MoveUpRight size={16} /></a>
      </div>

      <main>
        <section id="home" className="hero section-dark">
          <div className="hero-grid section-wrap">
            <div className="hero-copy">
              <p className="eyebrow hero-kicker"><span className="eyebrow-dot" /> Real estate educationalist <span>/</span> consultant <span>/</span> advisor</p>
              <h1 className="hero-title"><span className="line">Building <em>trust.</em></span><span className="line">Creating real estate</span><span className="line"><em>clarity.</em></span></h1>
              <p className="hero-lead">Empowering people with real estate knowledge, strategic guidance, and transparent property advisory to make smarter investment decisions.</p>
              <div className="hero-actions">
                <a className="button button-gold magnetic" href="#about">Explore my journey <ArrowDownRight size={17} /></a>
                <a className="button button-quiet magnetic" href="#contact">Book free consultation <MoveUpRight size={16} /></a>
              </div>
              <div className="hero-proof"><span className="proof-line" /><span>Pakistan real estate<br />knowledge, made human.</span></div>
            </div>
            <div className="hero-visual">
              <div className="hero-orbit hero-orbit-one" />
              <div className="hero-orbit hero-orbit-two" />
              <div className="hero-aa">AA</div>
              <div className="hero-art">
                <div className="hero-art-frame"><img className="hero-art-image" src="/assets/ali-pic-5.jpg" alt="Ali Amir at his office" /></div>
                <div className="hero-art-caption"><span>01</span><span>FOUNDER / ADVISOR</span></div>
              </div>
              <div className="hero-art-label label-one">Real estate<br /><strong>expertise</strong></div>
              <div className="hero-art-label label-two">Strategic<br /><strong>advisory</strong></div>
              <div className="hero-art-label label-three">Investment<br /><strong>guidance</strong></div>
            </div>
          </div>
          <div className="hero-bottom section-wrap"><span>SCROLL TO EXPLORE</span><div className="scroll-indicator"><span /></div><span>01 — 08</span></div>
        </section>

        <section className="marquee-section" aria-label="Areas of expertise">
          <div className="marquee-track">{[...marqueeItems, ...marqueeItems].map((item, index) => <span key={`${item}-${index}`}>{item}<i>✳</i></span>)}</div>
        </section>

        <section id="about" className="about section-light">
          <div className="section-wrap about-intro">
            <div className="section-index reveal"><span>02</span><span>THE PERSON BEHIND THE GUIDANCE</span></div>
            <div className="about-heading reveal"><p className="eyebrow">Who is Ali Amir?</p><h2>More than property.<br /><em>A journey built on trust.</em></h2></div>
          </div>
          <div className="section-wrap about-grid">
            <div className="about-image-wrap reveal"><div className="about-image-frame"><img src="/assets/ali-pic-1.jpg" alt="Ali Amir, real estate consultant" loading="lazy" /></div><span className="image-index">ALI AMIR / 02</span></div>
            <div className="about-copy">
              <p className="large-copy reveal">Ali Amir is a Real Estate Educationalist, Consultant, Advisor, and Influencer with over seven years of experience in the real estate industry.</p>
              <p className="body-copy reveal">His mission is to make property knowledge more accessible, promote transparency, and help people make informed real estate decisions. He works with first-time buyers, investors, overseas Pakistanis, builders, developers, and real estate learners.</p>
              <div className="role-list reveal">
                {['Founder & Managing Director, Property Advices by Ali Amir', 'Real Estate Educationalist', 'Real Estate Consultant & Advisor', 'Real Estate Influencer'].map((role) => <div key={role}><Check size={14} /><span>{role}</span></div>)}
              </div>
              <blockquote className="about-quote reveal"><Quote size={24} /><p>Knowledge before investment.<br /><em>Trust before transactions.</em></p></blockquote>
              <a className="text-link reveal" href="#expertise">Discover my story <ArrowUpRight size={16} /></a>
            </div>
          </div>
        </section>

        <section className="education-section section-light">
          <div className="section-wrap education-head"><div className="section-index reveal"><span>02A</span><span>LEARNING / PRACTICE / PROGRESS</span></div><div className="education-heading reveal"><p className="eyebrow">Education &amp; professional background</p><h2>Learning first.<br /><em>Practicing in the field.</em></h2></div></div>
          <div className="section-wrap education-grid">
            <article className="education-column reveal"><p className="column-label">Academic qualifications</p><ul><li>Diploma in Real Estate Law &amp; Taxation</li><li>Shariah Education <small>(In Progress)</small></li><li>Graduation <small>(In Progress)</small></li><li>Digital Marketing Certification, NED University</li></ul></article>
            <article className="education-column reveal"><p className="column-label">Additional training &amp; skills</p><ul><li>Public Speaking</li><li>Business Communication</li><li>Sales &amp; Marketing Skills</li><li>English Language</li></ul></article>
            <article className="education-column reveal"><p className="column-label">Content creation</p><ul><li>Educational real estate videos</li><li>Investment guidance content</li><li>Market awareness content</li><li>Project reviews and walkthroughs</li></ul></article>
          </div>
          <div className="section-wrap mission-band reveal"><div><p className="eyebrow">Vision &amp; mission</p><h3>Building a trusted real estate ecosystem in Pakistan.</h3></div><p>Educate people about real estate realities, protect buyers from unsafe and misleading investments, promote ethical marketing, and make real estate simpler, safer, and more human for everyone.</p></div>
        </section>

        <section className="stats-section section-dark">
          <div className="section-wrap stats-grid">
            <div className="stats-intro reveal"><p className="eyebrow"><span className="eyebrow-dot" /> The proof is in the practice</p><h2>Built through<br /><em>real experience.</em></h2></div>
            <div className="stat-item reveal"><div className="stat-number"><span data-count="7" data-suffix="+">0+</span></div><p>Years of real estate<br />experience</p></div>
            <div className="stat-item reveal"><div className="stat-number"><span data-count="100" data-suffix="%">0%</span></div><p>Free initial<br />consultation</p></div>
            <div className="stat-item reveal"><div className="stat-number"><span data-count="2">0</span></div><p>Specialist companies<br />under Ali Amir</p></div>
          </div>
        </section>

        <section id="services" className="services section-light">
          <div className="section-wrap services-head"><div className="section-index reveal"><span>03</span><span>WHAT I DO</span></div><div className="services-title reveal"><p className="eyebrow">Professional guidance</p><h2>Informed<br /><em>decisions.</em></h2></div><p className="services-note reveal">From understanding the market to making the move, every service starts with clarity.</p></div>
          <div className="section-wrap service-list">{serviceItems.map(({ number, title, body, icon: Icon }) => <div className="service-row reveal" key={title}><span className="service-number">{number}</span><div className="service-content"><h3>{title}</h3><p>{body}</p></div><div className="service-icon"><Icon size={22} strokeWidth={1.4} /></div><div className="service-hover-image"><img src="/assets/ali-pic-5.jpg" alt="" loading="lazy" /></div></div>)}</div>
          <div className="section-wrap services-foot reveal"><span>Guidance should come before profit.</span><a className="button button-dark" href="#contact">Talk to Ali Amir <MoveUpRight size={16} /></a></div>
        </section>

        <section id="expertise" className="expertise section-dark">
          <div className="section-wrap expertise-head"><div className="section-index reveal"><span>04</span><span>THE DIFFERENCE</span></div><div className="expertise-title reveal"><p className="eyebrow"><span className="eyebrow-dot" /> Six pillars of trust</p><h2>Experience that goes<br /><em>beyond transactions.</em></h2></div></div>
          <div className="section-wrap expertise-grid">{expertiseItems.map(([number, title, body, Icon]) => <article className="expertise-card reveal" key={title}><div className="expertise-card-top"><span>{number}</span><Icon size={22} strokeWidth={1.3} /></div><h3>{title}</h3><p>{body}</p><span className="card-arrow"><ArrowUpRight size={17} /></span></article>)}</div>
        </section>

        <section className="statement-section section-dark">
          <div className="statement-image"><img src="/assets/ali-pic-5.jpg" alt="Ali Amir in his office" loading="lazy" /></div>
          <div className="statement-overlay" />
          <div className="section-wrap statement-content"><p className="eyebrow reveal"><span className="eyebrow-dot" /> A point of view</p><h2 className="reveal">Real estate is not just about <em>property.</em><br />It's about people, decisions <br />&amp; <em>trust.</em></h2><div className="statement-foot reveal"><span>05 / BRAND STATEMENT</span><span className="statement-rule" /><span>ALI AMIR</span></div></div>
        </section>

        <section className="property-section section-light">
          <div className="section-wrap property-grid"><div className="property-copy"><div className="section-index reveal"><span>06</span><span>THE BUSINESS</span></div><p className="eyebrow reveal">Property Advices by Ali Amir</p><h2 className="reveal">A professional firm<br />for <em>clearer moves.</em></h2><p className="large-copy dark reveal">Real estate marketing and advisory for people who value correct information, ethical promotion, and long-term trust.</p><div className="property-points reveal"><span>Real estate marketing</span><span>Advisory services</span><span>Project promotion</span><span>Client guidance</span></div><a className="text-link reveal" href="#contact">Explore Property Advices <ArrowUpRight size={16} /></a></div><div className="property-panel reveal"><div className="panel-visual"><img src="/assets/ali-pic-1.jpg" alt="Property Advices by Ali Amir" loading="lazy" /><div className="panel-stamp">PA<br /><span>BY ALI AMIR</span></div></div><div className="panel-bottom"><span>Guidance before profit</span><ArrowUpRight size={18} /></div></div></div>
        </section>

        <section id="projects" className="projects section-dark">
          <div className="section-wrap projects-head"><div className="section-index reveal"><span>07</span><span>SELECTED WORK &amp; EXPERIENCE</span></div><div className="projects-title reveal"><p className="eyebrow"><span className="eyebrow-dot" /> No shortcuts. No made-up claims.</p><h2>Trust is built<br /><em>through evidence.</em></h2></div></div>
          <div className="section-wrap project-state reveal"><div className="project-state-mark"><span>AA</span><div><span className="line-reveal" /><span className="line-reveal" /></div></div><div className="project-state-copy"><p className="eyebrow">Verified project archive</p><h3>Real project case studies will appear here when they are available.</h3><p>Ali Amir’s public profile is built around real education, market guidance, and advisory work. This space intentionally avoids fabricated projects or client partnerships.</p><a className="button button-quiet" href="#contact">Ask about current work <MoveUpRight size={16} /></a></div></div>
        </section>

        <section id="contact" className="contact section-dark">
          <div className="section-wrap contact-grid"><div className="contact-copy"><div className="section-index reveal"><span>08</span><span>START A CONVERSATION</span></div><p className="eyebrow reveal"><span className="eyebrow-dot" /> Free initial consultation</p><h2 className="reveal">Your next property decision deserves <em>better guidance.</em></h2><p className="large-copy reveal">Start with a conversation. Get clarity before making your next move.</p><a className="whatsapp-link reveal" href="https://wa.me/923313719834" target="_blank" rel="noreferrer"><MessageCircle size={21} /><span><small>Connect directly</small>+92 331 3719834</span><ArrowUpRight size={17} /></a></div>
            <form className="contact-form reveal" onSubmit={handleFormSubmit} noValidate><div className="form-heading"><span>01 — 04</span><span>CONSULTATION REQUEST</span></div><Field label="Full Name" value={formState.name} error={formErrors.name} onChange={(value) => updateField('name', value)} /><Field label="Phone Number" value={formState.phone} error={formErrors.phone} onChange={(value) => updateField('phone', value)} /><Field label="Email Address" type="email" value={formState.email} error={formErrors.email} onChange={(value) => updateField('email', value)} /><label className="field field-textarea"><span>Message</span><textarea value={formState.message} onChange={(event) => updateField('message', event.target.value)} placeholder="Tell us what you are exploring..." rows={4} />{formErrors.message && <small>{formErrors.message}</small>}</label><button className="button button-gold" type="submit">Prepare consultation request <ArrowUpRight size={17} /></button>{formNote && <p className="form-note"><Check size={15} />{formNote}</p>}<p className="form-disclaimer">No fake success states. This form is ready for a real backend connection.</p></form>
          </div>
        </section>
      </main>

      <footer className="footer section-dark"><div className="section-wrap footer-top"><div><p className="eyebrow"><span className="eyebrow-dot" /> Ali Amir / 2026</p><h2>ALI <em>AMIR</em></h2></div><div className="footer-quote"><p>Built on knowledge.<br /><em>Driven by trust.</em></p><a className="button button-quiet" href="#home">Back to top <ArrowUpRight size={16} /></a></div></div><div className="section-wrap footer-links"><div><span>Real Estate Educationalist</span><span>Consultant</span><span>Advisor</span><span>Influencer</span></div><div className="footer-socials"><a href="https://www.facebook.com/Propertyadvicesbyaliamir/" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={17} /></a><a href="https://www.instagram.com/PropertyAdvicesByAliAmir" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17} /></a><a href="https://www.tiktok.com/@propertyadvicesbyaliamir" target="_blank" rel="noreferrer" aria-label="TikTok"><span className="social-letter">t</span></a><a href="https://wa.me/923313719834" target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={17} /></a></div></div><div className="section-wrap footer-bottom"><span>© 2026 Ali Amir. All rights reserved.</span><span>Knowledge before investment. Trust before transactions.</span></div></footer>
    </div>
  )
}

function Field({ label, type = 'text', value, error, onChange }: { label: string; type?: string; value: string; error?: string; onChange: (value: string) => void }) {
  return <label className="field"><span>{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={label === 'Email Address' ? 'you@example.com' : `Your ${label.toLowerCase()}`} />{error && <small>{error}</small>}</label>
}

export default App
