import { useEffect, useState } from 'react'
import styles from './KonamiEgg.module.css'

const KONAMI = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

export default function KonamiEgg() {
  const [active, setActive] = useState(false)
  const [seq, setSeq] = useState([])

  useEffect(() => {
    const onKey = (e) => {
      setSeq(prev => {
        const next = [...prev, e.key].slice(-KONAMI.length)
        if (next.join() === KONAMI.join()) {
          setActive(true)
          setTimeout(() => setActive(false), 3200)
          return []
        }
        return next
      })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!active) return null

  return (
    <div className={styles.overlay} aria-hidden="true">
      <div className={styles.skier}>
        <SkierSVG />
      </div>
    </div>
  )
}

function SkierSVG() {
  return (
    <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" fill="none">
      {/* Skis */}
      <line x1="10" y1="68" x2="95" y2="62" stroke="#1d9e75" strokeWidth="3" strokeLinecap="round" />
      <line x1="5" y1="74" x2="90" y2="68" stroke="#1d9e75" strokeWidth="3" strokeLinecap="round" />
      {/* Legs */}
      <line x1="50" y1="50" x2="42" y2="66" stroke="#e0e0e0" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="50" x2="55" y2="64" stroke="#e0e0e0" strokeWidth="3" strokeLinecap="round" />
      {/* Body — leaning forward */}
      <line x1="50" y1="50" x2="65" y2="32" stroke="#e0e0e0" strokeWidth="3.5" strokeLinecap="round" />
      {/* Head */}
      <circle cx="70" cy="26" r="8" fill="#e0e0e0" />
      {/* Helmet */}
      <path d="M63,26 Q65,16 75,18 Q78,26 70,26 Z" fill="#1d9e75" />
      {/* Poles */}
      <line x1="60" y1="40" x2="30" y2="68" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="70" y1="36" x2="95" y2="58" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
      {/* Speed lines */}
      <line x1="5" y1="40" x2="25" y2="38" stroke="#1d9e75" strokeWidth="1" opacity="0.5" />
      <line x1="0" y1="50" x2="18" y2="48" stroke="#1d9e75" strokeWidth="1" opacity="0.3" />
    </svg>
  )
}
