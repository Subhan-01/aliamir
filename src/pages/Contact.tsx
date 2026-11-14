import type { FormEvent } from 'react'
import { ArrowUpRight, Mail, MessageCircle } from 'lucide-react'
import { PageShell, PageHero } from '../components/Layout'
import { PM_EMAIL, SOCIALS, WA_ADVICE, WA_PM } from '../content/site'

const TOPICS = [
  'Property Buying Advice',
  'Investment Guidance',
  'Selling a Property',
  'Property Management Enquiry',
  'Overseas Pakistani Support',
  'General Question',
]

/** "Clicking Send Message will open WhatsApp with your enquiry pre-filled." */
function sendToWhatsApp(e: FormEvent<HTMLFormElement>) {
  e.preventDefault()
  const data = new FormData(e.currentTarget)
  const text = [
    `Name: ${String(data.get('name') ?? '')}`,
    `Email: ${String(data.get('email') ?? '')}`,
    `Topic: ${String(data.get('topic') ?? '')}`,
    `Message: ${String(data.get('message') ?? '')}`,
  ].join('\n')
  window.open(`${WA_ADVICE.href}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
}

export default function Contact() {
  return (
    <PageShell title="Contact Ali Amir | Free Real Estate Consultation Pakistan">
      <PageHero
        title={
          <>
            Contact <em>Ali Amir</em>
          </>
        }
        sub="Free real estate consultation — no obligation, no pressure"
      />

      <section className="block section-dark contact-block">
        <div className="section-wrap">
          <div className="contact-grid">
            <div className="contact-copy">
              <h2 className="sub-h2" data-split="heading">
                Get In Touch
              </h2>
              <p className="large-copy reveal">
                Whether you have a question about a property, need investment advice, or simply want to understand the market better — reach out.
                The first consultation is always free.
              </p>
              <div className="contact-links">
                <a className="whatsapp-link reveal" href={WA_ADVICE.href} target="_blank" rel="noreferrer" data-cursor="Chat">
                  <MessageCircle size={20} />
                  <span>
                    <small>WhatsApp — Property Advices</small>
                    {WA_ADVICE.number}
                  </span>
                  <ArrowUpRight size={18} />
                </a>
                <a className="whatsapp-link reveal" href={WA_PM.href} target="_blank" rel="noreferrer" data-cursor="Chat">
                  <MessageCircle size={20} />
                  <span>
                    <small>WhatsApp — Property Management</small>
                    {WA_PM.number}
                  </span>
                  <ArrowUpRight size={18} />
                </a>
                <a className="whatsapp-link reveal" href={`mailto:${PM_EMAIL}`} data-cursor="Email">
                  <Mail size={20} />
                  <span>
                    <small>Email — Property Management</small>
                    {PM_EMAIL}
                  </span>
                  <ArrowUpRight size={18} />
                </a>
              </div>
              <h3 className="sub-h3 follow reveal">Follow Ali Amir</h3>
              <div className="footer-social-links reveal">
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            <form className="contact-form reveal" onSubmit={sendToWhatsApp}>
              <h3 className="form-heading">Send an Enquiry</h3>
              <label className="field">
                <span>Your Name</span>
                <input name="name" type="text" autoComplete="name" required />
              </label>
              <label className="field">
                <span>Email Address</span>
                <input name="email" type="email" autoComplete="email" required />
              </label>
              <label className="field">
                <span>Topic</span>
                <select name="topic" defaultValue="" required>
                  <option value="" disabled>
                    — Select a topic —
                  </option>
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Message</span>
                <textarea name="message" rows={5} required />
              </label>
              <button className="button button-gold" type="submit" data-cursor="Send">
                Send Message <ArrowUpRight size={15} />
              </button>
              <p className="form-disclaimer">Clicking Send Message will open WhatsApp with your enquiry pre-filled.</p>
            </form>
          </div>
          <blockquote className="quote-xl quote-sm contact-quote">
            <p data-split="quote">"Guidance should come before profit."</p>
          </blockquote>
        </div>
      </section>
    </PageShell>
  )
}
