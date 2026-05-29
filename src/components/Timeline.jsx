import { useRef, useEffect, useCallback, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import styles from './Timeline.module.css'
import {
  EVENTS,
  PIXELS_PER_YEAR,
  EPOCH_DATE,
  END_DATE,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  LEGEND_CATEGORIES,
  getRaceCountdown,
} from '../data/timelineData'

// ─── Layout constants ─────────────────────────────────────────────────────────

const MS_PER_YEAR  = 365.25 * 24 * 60 * 60 * 1000
const CANVAS_PAD   = 240   // horizontal padding left/right (px)
const AXIS_Y       = 175   // px from canvas top to axis centre
const SPAN_H       = 4     // thickness of each span line (px)
const SPAN_MARGIN  = 2     // gap between axis centre and the inner span edge (px)
const SPAN_LAYER   = 3     // gap between above-1 and above-2 span lines (px)
const MIN_SPAN_W   = 12    // minimum span width for single-day events (px)
const LABEL_HALF   = 8     // assumed half-height of label text (px)

// Y of the top of each span line (drawn as a thin coloured horizontal rect)
const SPAN_TOP = {
  'above-1': AXIS_Y - SPAN_MARGIN - SPAN_H,                         // 169
  'above-2': AXIS_Y - SPAN_MARGIN - SPAN_H - SPAN_LAYER - SPAN_H,  // 162
  'below-1': AXIS_Y + SPAN_MARGIN,                                   // 177
  'below-2': AXIS_Y + SPAN_MARGIN + SPAN_H + SPAN_LAYER,            // 184
}

// Y of the vertical centre of the text label for each track
const LABEL_CY = {
  'above-1': AXIS_Y - 70,   // 105
  'above-2': AXIS_Y - 120,  //  55
  'below-1': AXIS_Y + 70,   // 245
  'below-2': AXIS_Y + 120,  // 295
}

const CANVAS_HEIGHT = AXIS_Y + 120 + LABEL_HALF + 40  // ~343 → pad to 360
const CANVAS_WIDTH  = dateToX(END_DATE) + CANVAS_PAD

// ─── Utilities ────────────────────────────────────────────────────────────────

function dateToX(date) {
  const d = typeof date === 'string' ? new Date(date) : date
  return CANVAS_PAD + ((d - EPOCH_DATE) / MS_PER_YEAR) * PIXELS_PER_YEAR
}

function fmtDate(dateStr) {
  if (!dateStr) return 'Present'
  return new Date(dateStr).toLocaleDateString('en-GB', { year: 'numeric', month: 'short' })
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Timeline() {
  const trackRef   = useRef(null)
  const isDragging = useRef(false)
  const startX     = useRef(0)
  const scrollLeft = useRef(0)
  const velocity   = useRef(0)
  const lastX      = useRef(0)
  const rafId      = useRef(null)

  const [tooltip, setTooltip] = useState(null)
  const daysLeft = getRaceCountdown()
  // useMemo so nowX is stable — a changing value would re-run the scroll-init effect on every tooltip update.
  const nowX = useMemo(() => dateToX(new Date()), [])

  const stopMomentum = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current)
  }, [])

  const applyMomentum = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    velocity.current *= 0.94
    el.scrollLeft -= velocity.current
    if (Math.abs(velocity.current) > 0.5) {
      rafId.current = requestAnimationFrame(applyMomentum)
    }
  }, [])

  // Drag-to-scroll + momentum
  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    el.scrollLeft = nowX - el.clientWidth * 0.6

    const onDown = (e) => {
      isDragging.current = true
      startX.current     = e.pageX - el.offsetLeft
      scrollLeft.current = el.scrollLeft
      lastX.current      = e.pageX
      velocity.current   = 0
      stopMomentum()
    }
    const onMove = (e) => {
      if (!isDragging.current) return
      e.preventDefault()
      el.scrollLeft    = scrollLeft.current - (e.pageX - el.offsetLeft - startX.current)
      velocity.current = lastX.current - e.pageX
      lastX.current    = e.pageX
    }
    const onUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      rafId.current = requestAnimationFrame(applyMomentum)
    }
    const onTouchStart = (e) => {
      isDragging.current = true
      startX.current     = e.touches[0].pageX - el.offsetLeft
      scrollLeft.current = el.scrollLeft
      lastX.current      = e.touches[0].pageX
      velocity.current   = 0
      stopMomentum()
    }
    const onTouchMove = (e) => {
      if (!isDragging.current) return
      el.scrollLeft    = scrollLeft.current - (e.touches[0].pageX - el.offsetLeft - startX.current)
      velocity.current = lastX.current - e.touches[0].pageX
      lastX.current    = e.touches[0].pageX
    }
    const onTouchEnd = () => {
      isDragging.current = false
      rafId.current = requestAnimationFrame(applyMomentum)
    }

    el.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove,   { passive: true })
    el.addEventListener('touchend', onTouchEnd)

    return () => {
      el.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      stopMomentum()
    }
  }, [applyMomentum, stopMomentum, nowX])

  // Track cursor for tooltip repositioning
  useEffect(() => {
    const onMove = (e) =>
      setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const startYear = EPOCH_DATE.getFullYear()
  const endYear   = END_DATE.getFullYear()
  const years     = Array.from({ length: endYear - startYear }, (_, i) => startYear + i)

  return (
    <section id="timeline" className={styles.section} aria-label="Timeline">
      <div className={styles.header}>
        <p className={styles.label}>Timeline</p>
        <h2 className={styles.heading}>Where I've been</h2>
        <p className={styles.hint}>Drag to explore ←→</p>
      </div>

      <div
        className={styles.trackWrapper}
        ref={trackRef}
        role="region"
        aria-label="Draggable timeline"
      >
        <div className={styles.canvas} style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>

          {/* Axis */}
          <div className={styles.axis} style={{ top: AXIS_Y }} />

          {/* Year ruler */}
          {years.map(year => <YearMarker key={year} year={year} />)}

          {/* NOW marker */}
          <div className={styles.nowMarker} style={{ left: nowX, top: AXIS_Y }}>
            <div className={styles.nowDot} />
            <span className={styles.nowLabel}>Now</span>
          </div>

          {/* Events */}
          {EVENTS.map(event => (
            <EventSpan
              key={event.id}
              event={event}
              daysLeft={daysLeft}
              onTooltip={setTooltip}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend} aria-label="Timeline legend">
        {LEGEND_CATEGORIES.map(cat => (
          <div key={cat} className={styles.legendItem}>
            <span
              className={styles.legendSwatch}
              style={{ background: CATEGORY_COLORS[cat] }}
              aria-hidden="true"
            />
            <span>{CATEGORY_LABELS[cat]}</span>
          </div>
        ))}
      </div>

      {tooltip && createPortal(
        <TooltipCard tooltip={tooltip} />,
        document.body
      )}
    </section>
  )
}

// ─── YearMarker ───────────────────────────────────────────────────────────────

function YearMarker({ year }) {
  const x        = dateToX(new Date(year, 0, 1))
  const isDecade = year % 10 === 0
  return (
    <div
      className={`${styles.yearMarker} ${isDecade ? styles.yearDecade : ''}`}
      style={{ left: x, top: AXIS_Y }}
      aria-hidden="true"
    >
      <div className={styles.yearTick} />
      <span className={styles.yearLabel}>{year}</span>
    </div>
  )
}

// ─── EventSpan ────────────────────────────────────────────────────────────────
//
// Each event renders three absolutely-positioned elements:
//   1. labelLine  — thin vertical connector from label to the span
//   2. span       — the coloured horizontal line near the axis
//   3. eventLabel — plain coloured text floating above/below

function EventSpan({ event, daysLeft, onTooltip }) {
  const color   = CATEGORY_COLORS[event.category]
  const x       = dateToX(new Date(event.start))
  const endDate = event.end ? new Date(event.end) : new Date()
  const spanW   = Math.max(dateToX(endDate) - x, MIN_SPAN_W)
  const midX    = x + spanW / 2

  const spanTop = SPAN_TOP[event.track]
  const labelCY = LABEL_CY[event.track]
  const isAbove = event.track.startsWith('above')

  // Connector top and height
  const connTop = isAbove ? labelCY + LABEL_HALF : spanTop + SPAN_H
  const connH   = isAbove
    ? spanTop - (labelCY + LABEL_HALF)
    : (labelCY - LABEL_HALF) - (spanTop + SPAN_H)

  const showTooltip = (e) => onTooltip({ event, x: e.clientX, y: e.clientY })
  const hideTooltip = ()   => onTooltip(null)

  const spanCls = [
    styles.span,
    event.isFuture    ? styles.spanFuture : '',
    event.isEasterEgg ? styles.spanEgg    : '',
  ].filter(Boolean).join(' ')

  const labelCls = [
    styles.eventLabel,
    event.isFuture      ? styles.labelFuture      : '',
    event.isPlaceholder ? styles.labelPlaceholder : '',
    event.isEasterEgg   ? styles.labelEgg         : '',
  ].filter(Boolean).join(' ')

  return (
    <>
      {/* Connector */}
      <div
        className={styles.labelLine}
        style={{ left: midX, top: connTop, height: Math.max(connH, 0), background: color }}
        aria-hidden="true"
      />

      {/* Span line near axis */}
      <div
        className={spanCls}
        style={{ left: x, top: spanTop, width: spanW, '--span-color': color }}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        aria-hidden="true"
      />

      {/* Label text */}
      <span
        className={labelCls}
        style={{ left: midX, top: labelCY - LABEL_HALF, color }}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        aria-label={`${event.label} — ${CATEGORY_LABELS[event.category] ?? event.category}`}
      >
        {event.label}
        {event.showCountdown && daysLeft != null && (
          <span className={styles.countdown}> · {daysLeft}d</span>
        )}
      </span>
    </>
  )
}

// ─── TooltipCard ──────────────────────────────────────────────────────────────

function TooltipCard({ tooltip }) {
  const { event, x, y } = tooltip
  const color      = CATEGORY_COLORS[event.category]
  const startLabel = fmtDate(event.start)
  const endLabel   = fmtDate(event.end)
  const dateRange  = event.start === event.end ? startLabel : `${startLabel} → ${endLabel}`

  return (
    <div
      className={styles.tooltip}
      style={{ position: 'fixed', left: x + 14, top: y - 14, transform: 'translateY(-100%)', pointerEvents: 'none', zIndex: 9999 }}
      role="tooltip"
    >
      <div className={styles.tooltipHeader} style={{ borderLeftColor: color }}>
        <strong className={styles.tooltipName}>{event.label}</strong>
        <span className={styles.tooltipCat} style={{ color }}>
          {CATEGORY_LABELS[event.category]}
        </span>
      </div>
      <div className={styles.tooltipDate}>{dateRange}</div>
      {event.description && (
        <p className={styles.tooltipDesc}>{event.description}</p>
      )}
    </div>
  )
}
