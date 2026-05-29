// Pixels per calendar year — controls the horizontal density of the timeline.
export const PIXELS_PER_YEAR = 180

// Left edge of the canvas corresponds to this date.
export const EPOCH_DATE = new Date('2003-01-01')

// Right edge of the canvas (after the last known event, with breathing room).
export const END_DATE = new Date('2029-01-01')

// Days until the triathlon race; returns null once the date has passed.
export function getRaceCountdown() {
  const diff = Math.ceil((new Date('2026-06-28') - new Date()) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : null
}

// ─── Category colours ────────────────────────────────────────────────────────

export const CATEGORY_COLORS = {
  'easter-egg': '#fbbf24',
  education:    '#34d399',
  military:     '#94a3b8',
  work:         '#60a5fa',
  internship:   '#22d3ee',
  project:      '#c084fc',
  athletics:    '#fb923c',
}

export const CATEGORY_LABELS = {
  'easter-egg': '★ Easter egg',
  education:    'Education',
  military:     'Military',
  work:         'Work',
  internship:   'Internship',
  project:      'Project',
  athletics:    'Athletics',
}

// Categories shown in the legend (easter-egg is intentionally omitted).
export const LEGEND_CATEGORIES = [
  'education',
  'military',
  'work',
  'internship',
  'project',
  'athletics',
]

// ─── Track layout ─────────────────────────────────────────────────────────────
//
// Tracks are vertical lanes relative to the axis:
//   above-1  →  closest lane above the axis  (education)
//   above-2  →  second lane above             (projects, athletics, easter egg)
//   below-1  →  closest lane below            (military, work)
//   below-2  →  second lane below             (internships)
//
// Positions are computed in Timeline.jsx from AXIS_Y and TRACK_SPACING.

// ─── Event data ───────────────────────────────────────────────────────────────
//
// Fields:
//   id            unique string
//   label         display name inside the bar
//   category      key of CATEGORY_COLORS / CATEGORY_LABELS
//   start         ISO date string  'YYYY-MM-DD'
//   end           ISO date string, or null for ongoing events
//   description   short text shown in the tooltip
//   track         'above-1' | 'above-2' | 'below-1' | 'below-2'
//   isFuture      (optional) dims the bar and uses a dashed border
//   isPlaceholder (optional) italic label styling
//   isEasterEgg   (optional) renders as a subtle icon instead of a labelled bar
//   showCountdown (optional) appends a "N days to go" badge

export const EVENTS = [
  // ── Easter egg ─────────────────────────────────────────────────────────────
  // Drag all the way left to find it — hover to reveal.
  {
    id: 'born',
    label: '✦',
    category: 'easter-egg',
    start: '2004-04-03',
    end: '2004-04-03',
    description: '🎂 A wild Karl-Fredrik appears.',
    track: 'above-2',
    isEasterEgg: true,
  },

  // ── Education ──────────────────────────────────────────────────────────────
  {
    id: 'highschool',
    label: 'Oslo Handelsgymnasium',
    category: 'education',
    start: '2020-08-01',
    end: '2023-06-15',
    description: 'High school at Oslo Handelsgymnasium.',
    track: 'above-1',
  },
  {
    id: 'uib',
    label: 'UiB – Computer Technology',
    category: 'education',
    start: '2024-08-15',
    end: null,
    description: "Bachelor's in Computer Technology at the University of Bergen. Ongoing.",
    track: 'above-1',
  },

  // ── Military ───────────────────────────────────────────────────────────────
  {
    id: 'af',
    label: 'Royal Norwegian Air Force',
    category: 'military',
    start: '2023-09-10',
    end: '2024-08-10',
    description: 'Mandatory military service in the Royal Norwegian Air Force.',
    track: 'below-1',
  },

  // ── Work ───────────────────────────────────────────────────────────────────
  {
    id: 'ta',
    label: 'Teaching Assistant',
    category: 'work',
    start: '2025-08-18',
    end: null,
    description: 'Teaching assistant at UiB. Ongoing.',
    track: 'below-1',
  },

  // ── Projects ───────────────────────────────────────────────────────────────
  {
    id: 'bekk',
    label: 'Bekk / VG',
    category: 'project',
    start: '2025-04-05',
    end: '2025-04-05',
    description: "Competed in Bekk's VG coding challenge.",
    track: 'above-2',
  },

  // ── Athletics ──────────────────────────────────────────────────────────────
  {
    id: 'tri',
    label: 'Olympic Triathlon',
    category: 'athletics',
    start: '2026-06-28',
    end: '2026-06-28',
    description: 'Race day — Olympic distance triathlon.',
    track: 'above-2',
    isFuture: true,
    showCountdown: true,
  },

  // ── Future / placeholder ───────────────────────────────────────────────────
  {
    id: 'internship',
    label: '[ internship? ]',
    category: 'internship',
    start: '2027-06-01',
    end: '2027-08-10',
    description: 'A potential summer internship — details TBD.',
    track: 'below-2',
    isFuture: true,
    isPlaceholder: true,
  },
]
