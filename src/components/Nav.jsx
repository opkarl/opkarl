import { useState, useEffect } from 'react'
import styles from './Nav.module.css'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = navLinks.map(l => l.href.slice(1))
    const observers = sections.map(id => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-40% 0px -55% 0px' }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])

  const handleNav = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} role="banner">
      <div className={styles.inner}>
        <span className={styles.brand}>Karl-Fredrik Opsahl</span>

        <nav aria-label="Primary navigation">
          <ul className={styles.links}>
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className={activeSection === href.slice(1) ? styles.active : ''}
                  onClick={e => handleNav(e, href)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav
        className={`${styles.mobile} ${menuOpen ? styles.open : ''}`}
        aria-label="Mobile navigation"
      >
        {navLinks.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            className={activeSection === href.slice(1) ? styles.active : ''}
            onClick={e => handleNav(e, href)}
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  )
}
