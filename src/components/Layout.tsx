import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, MessageCircle, X } from 'lucide-react'
import { LOGO, NAV, SOCIALS, WA_ADVICE } from '../content/site'
import { usePageMotion } from '../motion/usePageMotion'
import { ScrollGuide } from './ScrollGuide'
import { PageRoute } from './PageRoute'

/* ----------------------------------------------------------------------------
 * Navigation (structure and links exactly as on the live site)
 * -------------------------------------------------------------------------- */

export function SiteNav({ menuOpen, onToggle, onClose }: { menuOpen: boolean; onToggle: () => void; onClose: () => void }) {
  return (
    <header className="site-nav">
      <Link className="brand-lockup" to="/" aria-label="Ali Amir — Home" onClick={onClose}>
        <span className="brand-logo-frame">
          <img src={LOGO} alt="Ali Amir" />
          <span className="logo-sheen" aria-hidden="true" />
        </span>
      </Link>
      <nav className="desktop-nav" aria-label="Primary">
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        onClick={onToggle}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={menuOpen ? 'close' : 'open'}
            style={{ display: 'inline-flex' }}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.span>
        </AnimatePresence>
      </button>
    </header>
  )
}

const panel = {
  hidden: { clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] as const, when: 'afterChildren' as const } },
  show: {
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const, when: 'beforeChildren' as const, staggerChildren: 0.06 },
  },
}
const item = {
  hidden: { opacity: 0, y: 28, transition: { duration: 0.2 } },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
}

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          id="mobile-menu"
          className="mobile-menu is-open"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          variants={panel}
          initial="hidden"
          animate="show"
          exit="hidden"
        >
          <nav aria-label="Mobile">
            {NAV.map((n) => (
              <motion.div key={n.to} variants={item} whileHover={{ x: 14 }} whileTap={{ x: 20, scale: 0.985 }}>
                <NavLink to={n.to} end={n.to === '/'} onClick={onClose}>
                  {n.label}
                  <ArrowUpRight size={22} />
                </NavLink>
              </motion.div>
            ))}
          </nav>
          <motion.div variants={item}>
            <Link className="button button-gold mobile-menu-cta" to="/contact" onClick={onClose}>
              Free Consultation <ArrowUpRight size={15} />
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ----------------------------------------------------------------------------
 * Footer (content exactly as on the live site)
 * -------------------------------------------------------------------------- */

export function SiteFooter() {
  return (
    <footer className="site-footer section-dark">
      <div className="section-wrap">
        <div className="footer-grid rule-top">
          <div className="footer-brand">
            <span className="footer-logo reveal">
              <img src={LOGO} alt="Ali Amir" loading="lazy" decoding="async" />
            </span>
            <h3 className="footer-heading reveal">Get In Touch</h3>
            <p className="footer-sub reveal">Free consultation for your real estate decisions</p>
            <a className="whatsapp-link reveal" href={WA_ADVICE.href} target="_blank" rel="noreferrer" data-cursor="Chat">
              <MessageCircle size={20} />
              <span>WhatsApp: {WA_ADVICE.number}</span>
              <ArrowUpRight size={18} />
            </a>
            <div className="footer-social-links reveal">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              ))}
              <a href={WA_ADVICE.href} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </div>
          </div>
          <div className="footer-statement">
            <p className="footer-tag" data-split="quote">
              AliAmir.com represents a name built on learning,
              <br />a company built on trust,
              <br />
              and a vision built on responsibility.
            </p>
            <p className="footer-copy reveal">
              Ali Amir continues to learn, grow, and serve — with the goal of making real estate simpler, safer, and more human for everyone.
            </p>
          </div>
        </div>
        <div className="footer-bottom rule-top">
          <span>© 2026 Ali Amir. All rights reserved.</span>
          <span>
            Powered by{' '}
            <a href="https://innovators4u.com" target="_blank" rel="noreferrer">
              innovators4u
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}

/* ----------------------------------------------------------------------------
 * Page shell: route transition (Framer Motion: opacity only) + page motion (GSAP)
 * -------------------------------------------------------------------------- */

export function PageShell({ title, children }: { title: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    window.scrollTo(0, 0) // new page always starts at the top (CSS scroll-behavior is auto)
  }, [])
  useEffect(() => {
    document.title = title
  }, [title])

  usePageMotion(ref)

  return (
    <motion.main
      ref={ref}
      className="page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      {children}
      <SiteFooter />
      <PageRoute />
      <ScrollGuide />
    </motion.main>
  )
}

/* ----------------------------------------------------------------------------
 * Small shared pieces
 * -------------------------------------------------------------------------- */

export function PageHero({ title, sub, children }: { title: ReactNode; sub?: string; children?: ReactNode }) {
  return (
    <section className="page-hero section-dark">
      <div className="section-wrap">
        <h1 data-hero="title">{title}</h1>
        {sub && (
          <p className="block-sub" data-hero="lead">
            {sub}
          </p>
        )}
        {children}
        <div className="rule" data-draw />
      </div>
    </section>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow reveal">
      <span className="eyebrow-dot" />
      {children}
    </p>
  )
}

export function Quote({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <blockquote className={`quote-xl ${className}`.trim()}>
      <p data-split="quote">{children}</p>
    </blockquote>
  )
}
