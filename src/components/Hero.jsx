import { useEffect, useRef, useState } from 'react'
import styles from './Hero.module.css'
import { getRaceCountdown } from '../data/timelineData'

const TICKER_ITEMS = [
  { text: 'Oslo, Norway' },
  { text: 'BSc Computer Technology @ UiB' },
  { text: null, key: 'race' },
  { text: 'Currently optimizing: everything' },
]

export default function Hero() {
  const cyclistRef = useRef(null)
  const rafRef     = useRef(null)
  const textVisibleRef = useRef(false)

  const [textVisible, setTextVisible] = useState(false)
  const [tickerVisible, setTickerVisible] = useState([false, false, false, false])
  const daysLeft = getRaceCountdown()

  useEffect(() => {
    const timers = TICKER_ITEMS.map((_, i) =>
      setTimeout(() => {
        setTickerVisible(prev => { const next = [...prev]; next[i] = true; return next })
      }, 300 + i * 130)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const update = () => {
      const scrollY = window.scrollY
      const wW = window.innerWidth
      const wH = window.innerHeight

      // Overall progress 0→1 over the 100vh scroll slot
      const progress = Math.min(1, scrollY / wH)

      // ── Cyclist: constant velocity from off-screen to 80% viewport ──
      if (cyclistRef.current)
        cyclistRef.current.style.transform = `translateX(${-200 + Math.min(1, progress / 0.75) * (wW * 0.80 + 200) - 140}px)`

      // ── Text: fades in during phase 0.75 → 1.0 ───────────────────
      const shouldShow = progress >= 0.75
      if (shouldShow !== textVisibleRef.current) {
        textVisibleRef.current = shouldShow
        setTextVisible(shouldShow)
      }
    }

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.hero} aria-label="Introduction">
        <div className={styles.visual}>
          <div className={styles.terrain}><TerrainSVG /></div>

          <div ref={cyclistRef} className={`${styles.athlete} ${styles.cyclist}`}>
            <CyclistSVG />
          </div>

          <div className={`${styles.overlay} ${textVisible ? styles.overlayVisible : ''}`}>
            <h1 className={styles.heading}>
              Building clean software.<br />Training for a triathlon.
            </h1>
            <p className={styles.subheading}>
              IT student, teaching assistant,<br />Royal Norwegian Air Force veteran.
            </p>
            <div className={styles.ctas}>
              <a
                href="#projects"
                className={styles.btnFilled}
                onClick={e => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) }}
              >
                See my work
              </a>
              <a href={`${import.meta.env.BASE_URL}cv.pdf`} className={styles.btnOutline} download>
                Download CV
              </a>
            </div>
            <div className={styles.ticker} aria-label="Quick facts">
              {TICKER_ITEMS.map((item, i) => (
                <div key={i} className={`${styles.tickerItem} ${tickerVisible[i] ? styles.tickerVisible : ''}`}>
                  <span className={styles.dot} aria-hidden="true" />
                  {item.key === 'race'
                    ? <span>Race day:{daysLeft != null ? <> <span className={styles.countdown}>{daysLeft} days</span> to go</> : ' June 28 ✓'}</span>
                    : <span>{item.text}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function TerrainSVG() {
  return (
    <svg
      style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%', display: 'block' }}
      viewBox="0 0 900 300"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMax slice"
    >
      <polygon points="0,300 120,100 220,180 340,60 460,160 580,80 700,140 820,50 900,120 900,300" style={{ fill: 'var(--terrain-far)' }} />
      <polygon points="0,300 80,220 200,170 350,200 500,160 650,190 800,155 900,180 900,300" style={{ fill: 'var(--terrain-mid)' }} />
      <rect x="0" y="270" width="900" height="30" style={{ fill: 'var(--terrain-ground)' }} />
      <rect x="0" y="272" width="900" height="6" style={{ fill: 'var(--terrain-road)' }} />
    </svg>
  )
}


function CyclistSVG() {
  return (
    <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" fill="none">
      <circle cx="42" cy="118" r="34" stroke="#1d9e75" strokeWidth="3" fill="none" />
      <circle cx="42" cy="118" r="4" fill="#1d9e75" />
      <circle cx="158" cy="118" r="34" stroke="#1d9e75" strokeWidth="3" fill="none" />
      <circle cx="158" cy="118" r="4" fill="#1d9e75" />
      <line x1="42" y1="118" x2="100" y2="70" stroke="#e0e0e0" strokeWidth="2.5" />
      <line x1="42" y1="118" x2="100" y2="118" stroke="#e0e0e0" strokeWidth="2.5" />
      <line x1="100" y1="118" x2="158" y2="118" stroke="#e0e0e0" strokeWidth="2.5" />
      <line x1="100" y1="70" x2="158" y2="118" stroke="#e0e0e0" strokeWidth="2.5" />
      <line x1="100" y1="70" x2="100" y2="118" stroke="#e0e0e0" strokeWidth="2" />
      <line x1="90" y1="70" x2="85" y2="50" stroke="#e0e0e0" strokeWidth="2.5" />
      <line x1="80" y1="48" x2="94" y2="48" stroke="#e0e0e0" strokeWidth="3" />
      <line x1="152" y1="82" x2="155" y2="65" stroke="#e0e0e0" strokeWidth="2.5" />
      <line x1="150" y1="64" x2="162" y2="64" stroke="#e0e0e0" strokeWidth="2.5" />
      <line x1="87" y1="49" x2="148" y2="68" stroke="#e0e0e0" strokeWidth="3" />
      <circle cx="155" cy="60" r="9" fill="#e0e0e0" />
      <line x1="140" y1="64" x2="157" y2="64" stroke="#e0e0e0" strokeWidth="2.5" />
      <line x1="100" y1="118" x2="110" y2="135" stroke="#e0e0e0" strokeWidth="3" />
      <line x1="110" y1="135" x2="102" y2="148" stroke="#e0e0e0" strokeWidth="3" />
      <line x1="100" y1="118" x2="88" y2="105" stroke="#e0e0e0" strokeWidth="3" />
      <line x1="88" y1="105" x2="96" y2="94" stroke="#e0e0e0" strokeWidth="3" />
      <circle cx="100" cy="118" r="6" fill="none" stroke="#1d9e75" strokeWidth="2" />
    </svg>
  )
}

