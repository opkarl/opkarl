import { useRef, useEffect, useState } from 'react'
import styles from './SportDivider.module.css'

export default function SwimDivider() {
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
      aria-label="Swim section divider"
      role="img"
    >
      <svg className={styles.svg} viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
        {/* Water line */}
        <line x1="0" y1="55" x2="200" y2="55" stroke="#222" strokeWidth="1" />

        {/* Swimmer body - side profile, freestyle */}
        <g className={styles.swimBody}>
          <ellipse cx="95" cy="45" rx="28" ry="8" fill="#1d9e75" transform="rotate(-8, 95, 45)" />
          <circle cx="126" cy="42" r="9" fill="#1d9e75" />
          <ellipse cx="126" cy="38" rx="8" ry="5" fill="#f0f0f0" />
          <ellipse cx="68" cy="47" rx="10" ry="6" fill="#1d9e75" transform="rotate(-8, 68, 47)" />
        </g>

        {/* Front arm: shoulder (125,44) is top-left of its fill-box → 0% 0% */}
        <g className={styles.armForward}>
          <line x1="125" y1="44" x2="148" y2="52" stroke="#1d9e75" strokeWidth="4" strokeLinecap="round" />
          <line x1="148" y1="52" x2="158" y2="58" stroke="#1d9e75" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Back arm: shoulder (80,43) is bottom-right of its fill-box → 100% 100% */}
        <g className={styles.armBack}>
          <line x1="80" y1="43" x2="58" y2="32" stroke="#1d9e75" strokeWidth="4" strokeLinecap="round" />
          <line x1="58" y1="32" x2="50" y2="38" stroke="#1d9e75" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Kick (legs) */}
        <line x1="68" y1="49" x2="45" y2="52" stroke="#1d9e75" strokeWidth="3" strokeLinecap="round" />
        <line x1="68" y1="49" x2="44" y2="46" stroke="#1d9e75" strokeWidth="3" strokeLinecap="round" />

        {/* Water ripples */}
        <path d="M30,58 Q45,54 60,58 Q75,62 90,58" fill="none" stroke="#1d9e75" strokeWidth="1" opacity="0.3" />
        <path d="M100,60 Q115,56 130,60 Q145,64 160,60" fill="none" stroke="#1d9e75" strokeWidth="1" opacity="0.2" />
      </svg>
    </div>
  )
}
