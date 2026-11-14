import { useCallback, useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { LOGO } from './content/site'
import { MobileMenu, SiteNav } from './components/Layout'
import { ScrollBackground } from './components/ScrollBackground'
import { shouldShowLoader } from './motion/env'
import { useGlobalMotion } from './motion/useGlobalMotion'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import PropertyManagement from './pages/PropertyManagement'
import Vision from './pages/Vision'
import Contact from './pages/Contact'

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showLoader, setShowLoader] = useState(shouldShowLoader)

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const handleLoaderDone = useCallback(() => setShowLoader(false), [])

  useGlobalMotion(rootRef, { loader: showLoader, onLoaderDone: handleLoaderDone })

  // lock page scroll while the mobile menu is open; Escape closes it
  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <MotionConfig reducedMotion="user">
      <div className="site-shell" ref={rootRef}>
        {showLoader && (
          <div className="loader" aria-hidden="true">
            <div className="loader-inner">
              <div className="loader-logo-wrap">
                <img className="loader-logo" src={LOGO} alt="" />
                <span className="logo-sheen" aria-hidden="true" />
              </div>
              <div className="loader-line" />
            </div>
          </div>
        )}
        <ScrollBackground />
        <div className="scroll-progress" aria-hidden="true" />
        <div className="pointer-glow" aria-hidden="true" />
        <div className="cursor" aria-hidden="true">
          <span className="cursor-dot" />
          <span className="cursor-ring">
            <span className="cursor-ring-inner" />
            <span className="cursor-label" />
          </span>
        </div>

        <SiteNav menuOpen={menuOpen} onToggle={() => setMenuOpen((v) => !v)} onClose={closeMenu} />
        <MobileMenu open={menuOpen} onClose={closeMenu} />

        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/property-management" element={<PropertyManagement />} />
            <Route path="/vision" element={<Vision />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
