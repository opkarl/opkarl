import { useRef, useEffect, useState } from 'react'
import styles from './SportDivider.module.css'

export default function RunDivider() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${styles.divider} ${visible ? styles.visible : ''}`}
      aria-label="Run section divider"
      role="img"
    >
      <svg className={styles.svg} viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" fill="none">
        <g className={styles.runnerGroup} style={{ transformOrigin: '60px 45px' }}>
          {/* Head */}
          <circle cx="65" cy="14" r="8" fill="#1d9e75" />

          {/* Torso */}
          <line x1="65" y1="22" x2="62" y2="48" stroke="#1d9e75" strokeWidth="4" strokeLinecap="round" />

          {/* Back arm */}
          <g className={styles.runArmBack} style={{ transformOrigin: '65px 28px' }}>
            <line x1="65" y1="28" x2="50" y2="38" stroke="#1d9e75" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="38" x2="44" y2="34" stroke="#1d9e75" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Front arm */}
          <g className={styles.runArmFront} style={{ transformOrigin: '65px 28px' }}>
            <line x1="65" y1="28" x2="78" y2="35" stroke="#1d9e75" strokeWidth="3" strokeLinecap="round" />
            <line x1="78" y1="35" x2="84" y2="30" stroke="#1d9e75" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Back leg */}
          <g className={styles.runLegBack} style={{ transformOrigin: '62px 48px' }}>
            <line x1="62" y1="48" x2="50" y2="64" stroke="#1d9e75" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="50" y1="64" x2="42" y2="76" stroke="#1d9e75" strokeWidth="3.5" strokeLinecap="round" />
          </g>

          {/* Front leg */}
          <g className={styles.runLegFront} style={{ transformOrigin: '62px 48px' }}>
            <line x1="62" y1="48" x2="74" y2="60" stroke="#1d9e75" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="74" y1="60" x2="80" y2="74" stroke="#1d9e75" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        </g>

        {/* Ground */}
        <line x1="0" y1="78" x2="120" y2="78" stroke="#222" strokeWidth="1" />
      </svg>
    </div>
  )
}
