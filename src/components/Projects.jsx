import { useState, useRef, useCallback } from 'react'
import { useFadeIn } from '../hooks/useFadeIn'
import styles from './Projects.module.css'
import Pathfinder from './pathfinder/Pathfinder'
import SortingVisualizer from './sorting/SortingVisualizer'
import WordleSolver from './wordle/WordleSolver'

const FADE_MS = 180

const DEMOS = [
  {
    label: 'Pathfinding',
    title: 'Pathfinding Visualizer',
    desc: 'Draw walls on a grid, set start/end, watch A*, BFS, or DFS find the route in real time. Switch algorithms and see the difference visually.',
    component: <Pathfinder />,
  },
  {
    label: 'Sorting',
    title: 'Sorting Visualizer',
    desc: 'Pick bubble, insertion, or quicksort and watch it race through a shuffled array — bar by bar, swap by swap.',
    component: <SortingVisualizer />,
  },
]

// if you're reading this, you're exactly the kind of person i want to work with.

const PROJECTS = [
  {
    index: '01',
    title: null, // driven by DEMOS[demoIndex]
    desc: null,
    result: 'Flagship — live demo embedded below',
    tags: ['Algorithm', 'Interactive', 'Visualization'],
    url: null,
    showVisualizer: true,
    icon: '⬡',
  },
  {
    index: '02',
    title: 'x.vg.no Product Workshop',
    desc: 'Weekend workshop demo for VG — pitched a more social news platform with fluid motion, minigames, and moderation ideas.',
    result: 'Bekk competition · team of 4 · advanced to Oslo finals',
    tags: ['Competition', 'UX', 'Motion'],
    url: null,
    icon: '◈',
  },
  {
    index: '03',
    title: 'Wordle Solver Algorithm',
    desc: 'Hybrid solver using feedback narrowing, frequency scoring, and minimax partitioning to pick optimal guesses.',
    result: '2nd place in class',
    tags: ['Algorithm', 'Search', 'Optimization'],
    url: null,
    showWordle: true,
    icon: '◻',
  },
  {
    index: '04',
    title: 'Immortal Knight Escape',
    desc: '3D Wolfenstein-style game in JPanel + Swing with raycasting visuals over a grid world.',
    result: 'Built from scratch in Java — no game engine',
    tags: ['Game', '3D', 'Raycasting'],
    url: 'https://github.com/opkarl/Immortal-Knight-Escape',
    icon: '⚔',
  },
]

const ALL_TAGS = [...new Set(PROJECTS.flatMap(p => p.tags))]

export default function Projects() {
  const [activeTag, setActiveTag] = useState(null)
  const [demoIndex, setDemoIndex] = useState(0)
  const [displayedDemoIndex, setDisplayedDemoIndex] = useState(0)
  const [demoTextFading, setDemoTextFading] = useState(false)
  const ref = useRef(null)
  useFadeIn(ref)

  const changeDemoIndex = useCallback((next) => {
    setDemoTextFading(true)
    setDemoIndex(next)
    setTimeout(() => {
      setDisplayedDemoIndex(next)
      setDemoTextFading(false)
    }, FADE_MS)
  }, [])

  const handleRowClick = (project) => {
    if (project.url) {
      window.open(project.url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleTagClick = (e, tag) => {
    e.stopPropagation()
    setActiveTag(prev => prev === tag ? null : tag)
  }

  return (
    <section id="projects" className={styles.section} aria-label="Projects">
      <div className="container" ref={ref}>
        <p className={`${styles.label} fade-up`}>Projects</p>

        <div className={styles.list}>
          {PROJECTS.map((project) => {
            const isDimmed = activeTag && !project.tags.includes(activeTag)
            const title = project.showVisualizer ? DEMOS[displayedDemoIndex].title : project.title
            const desc  = project.showVisualizer ? DEMOS[displayedDemoIndex].desc  : project.desc
            return (
              <div key={project.index}>
                <div
                  className={`${styles.row} fade-up ${isDimmed ? styles.dimmed : ''}`}
                  onClick={() => handleRowClick(project)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${title}`}
                  onKeyDown={e => e.key === 'Enter' && handleRowClick(project)}
                >
                  <span className={styles.index}>{project.index}</span>

                  <div className={styles.meta}>
                    <p className={`${styles.title} ${project.showVisualizer && demoTextFading ? styles.textFading : ''}`}>
                      {title}
                    </p>
                    <p className={`${styles.desc} ${project.showVisualizer && demoTextFading ? styles.textFading : ''}`}>
                      {desc}
                    </p>
                    <p className={styles.result}>{project.result}</p>
                    <div className={styles.tags}>
                      {project.tags.map(tag => (
                        <button
                          key={tag}
                          className={`${styles.tag} ${activeTag === tag ? styles.activeTag : ''}`}
                          onClick={e => handleTagClick(e, tag)}
                          aria-label={`Filter by ${tag}`}
                          aria-pressed={activeTag === tag}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.thumbnail} aria-hidden="true">
                    <span className={styles.thumbIcon}>{project.icon}</span>
                  </div>
                </div>

                {project.showWordle && (
                  <div className={`${styles.demoStandalone} fade-up`}>
                    <div className={styles.demoWindow}>
                      <div className={styles.demoSlide}>
                        <WordleSolver />
                      </div>
                    </div>
                  </div>
                )}

                {project.showVisualizer && (
                  <div className={`${styles.demoCarousel} fade-up`}>
                    <button
                      className={styles.demoArrow}
                      onClick={() => changeDemoIndex((demoIndex - 1 + DEMOS.length) % DEMOS.length)}
                      aria-label="Previous demo"
                    >
                      ‹
                    </button>
                    <div className={styles.demoWindow}>
                      <div
                        className={styles.demoTrack}
                        style={{ transform: `translateX(${-demoIndex * 100}%)` }}
                      >
                        {DEMOS.map((demo, di) => (
                          <div key={di} className={styles.demoSlide}>
                            {demo.component}
                          </div>
                        ))}
                      </div>
                      <div className={styles.demoDots}>
                        {DEMOS.map((demo, di) => (
                          <button
                            key={di}
                            className={`${styles.demoDot} ${demoIndex === di ? styles.demoDotActive : ''}`}
                            onClick={() => changeDemoIndex(di)}
                            aria-label={`Switch to ${demo.label}`}
                          />
                        ))}
                      </div>
                    </div>
                    <button
                      className={styles.demoArrow}
                      onClick={() => changeDemoIndex((demoIndex + 1) % DEMOS.length)}
                      aria-label="Next demo"
                    >
                      ›
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
