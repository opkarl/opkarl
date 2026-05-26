import { useRef, useEffect, useCallback } from 'react'
import styles from './Timeline.module.css'

function getRaceCountdown() {
  const now = new Date()
  let raceDate = new Date(now.getFullYear(), 5, 28)
  if (now > raceDate) raceDate = new Date(now.getFullYear() + 1, 5, 28)
  return Math.ceil((raceDate - now) / (1000 * 60 * 60 * 24))
}

const ENTRIES = [
  // Hidden easter egg — drag way left to find it
  {
    id: 'egg',
    label: 'Karl-Fredrik learns that falling\nis also part of the plan.',
    date: '~2005',
    type: 'athletics',
    position: 'above',
    isEasterEgg: true,
  },
  // TODO: real dates for Air Force service
  {
    id: 'af',
    label: 'Royal Norwegian Air Force',
    date: '2021 – 2022', // TODO: real dates
    type: 'military',
    position: 'above',
  },
  {
    id: 'uib',
    label: 'UiB Computer Technology begins',
    date: '2022',
    type: 'education',
    position: 'below',
  },
  {
    id: 'ta1',
    label: 'Teaching Assistant — Sem. 1',
    date: '2023',
    type: 'development',
    position: 'above',
  },
  {
    id: 'ta2',
    label: 'Teaching Assistant — Sem. 2',
    date: '2024',
    type: 'development',
    position: 'below',
  },
  {
    id: 'bekk',
    label: 'Bekk / VG Competition',
    date: '2024',
    type: 'development',
    position: 'above',
  },
  {
    id: 'now',
    label: 'You are here',
    date: 'Today',
    type: 'now',
    position: 'below',
  },
  {
    id: 'tri',
    label: 'Olympic Triathlon — Race Day',
    date: 'June 28, 2025',
    type: 'athletics',
    position: 'above',
    isFuture: true,
    showCountdown: true,
  },
  {
    id: 'internship',
    label: '[ internship? ]',
    date: '—',
    type: 'development',
    position: 'below',
    isFuture: true,
    isPlaceholder: true,
  },
]

const TYPE_COLORS = {
  military: '#444',
  education: '#1d9e75',
  development: '#4a9eff',
  athletics: '#e8945a',
}

export default function Timeline() {
  const trackRef = useRef(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const velocity = useRef(0)
  const lastX = useRef(0)
  const rafId = useRef(null)
  const daysLeft = getRaceCountdown()

  const stopMomentum = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current)
  }, [])

  const applyMomentum = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    velocity.current *= 0.94
    track.scrollLeft -= velocity.current
    if (Math.abs(velocity.current) > 0.5) {
      rafId.current = requestAnimationFrame(applyMomentum)
    }
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // Start near "NOW" entry (roughly center-ish)
    track.scrollLeft = 600

    const onMouseDown = (e) => {
      isDragging.current = true
      startX.current = e.pageX - track.offsetLeft
      scrollLeft.current = track.scrollLeft
      lastX.current = e.pageX
      velocity.current = 0
      stopMomentum()
    }

    const onMouseMove = (e) => {
      if (!isDragging.current) return
      e.preventDefault()
      const x = e.pageX - track.offsetLeft
      const walk = x - startX.current
      track.scrollLeft = scrollLeft.current - walk
      velocity.current = lastX.current - e.pageX
      lastX.current = e.pageX
    }

    const onMouseUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      rafId.current = requestAnimationFrame(applyMomentum)
    }

    const onTouchStart = (e) => {
      isDragging.current = true
      startX.current = e.touches[0].pageX - track.offsetLeft
      scrollLeft.current = track.scrollLeft
      lastX.current = e.touches[0].pageX
      velocity.current = 0
      stopMomentum()
    }

    const onTouchMove = (e) => {
      if (!isDragging.current) return
      const x = e.touches[0].pageX - track.offsetLeft
      const walk = x - startX.current
      track.scrollLeft = scrollLeft.current - walk
      velocity.current = lastX.current - e.touches[0].pageX
      lastX.current = e.touches[0].pageX
    }

    const onTouchEnd = () => {
      isDragging.current = false
      rafId.current = requestAnimationFrame(applyMomentum)
    }

    track.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    track.addEventListener('touchstart', onTouchStart, { passive: true })
    track.addEventListener('touchmove', onTouchMove, { passive: true })
    track.addEventListener('touchend', onTouchEnd)

    return () => {
      track.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      track.removeEventListener('touchstart', onTouchStart)
      track.removeEventListener('touchmove', onTouchMove)
      track.removeEventListener('touchend', onTouchEnd)
      stopMomentum()
    }
  }, [applyMomentum, stopMomentum])

  return (
    <section id="timeline" className={styles.section} aria-label="Timeline">
      <div className={styles.header}>
        <p className={styles.label}>Timeline</p>
        <h2 className={styles.heading}>Where I've been</h2>
        <p className={styles.hint}>Drag to explore ←→</p>
      </div>

      <div
        className={styles.trackWrapper}
        role="region"
        aria-label="Draggable timeline"
      >
        <div className={styles.track} ref={trackRef}>
          {ENTRIES.map((entry, i) => (
            <TimelineNode
              key={entry.id}
              entry={entry}
              daysLeft={daysLeft}
            />
          ))}
        </div>
      </div>

      <div className={styles.legend} aria-label="Timeline legend">
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: color }} aria-hidden="true" />
            <span style={{ textTransform: 'capitalize' }}>{type}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function TimelineNode({ entry, daysLeft }) {
  const isAbove = entry.position === 'above'
  const nodeClass = [
    styles.node,
    entry.isFuture ? styles.future : '',
    entry.isPlaceholder ? styles.nodePlaceholder : '',
    entry.isEasterEgg ? styles.easterEgg : '',
  ].filter(Boolean).join(' ')

  const dotClass = [
    styles.dot,
    styles[entry.type] || '',
    entry.type === 'now' ? styles.now : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={nodeClass} aria-label={`${entry.label}, ${entry.date}`}>
      <div className={`${styles.nodeContent} ${isAbove ? styles.above : styles.below}`}>
        <p className={styles.nodeLabel}>{entry.label}</p>
        <p className={styles.nodeDate}>{entry.date}</p>
        {entry.type === 'now' && <p className={styles.nowLabel}>Now</p>}
        {entry.showCountdown && (
          <p className={styles.nodeCountdown}>{daysLeft}d to race</p>
        )}
      </div>

      <div className={dotClass} aria-hidden="true" />
    </div>
  )
}
