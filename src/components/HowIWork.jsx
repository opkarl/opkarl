import { useRef } from 'react'
import { useFadeIn } from '../hooks/useFadeIn'
import styles from './HowIWork.module.css'

const PRINCIPLES = [
  {
    title: '[PRINCIPLE TITLE]',
    // TODO: Karl-Fredrik to fill in — write this in your own voice. See portfolio plan for guidance.
    body: '[Karl-Fredrik to fill in — write this in your own voice. See portfolio plan for guidance.]',
  },
  {
    title: '[PRINCIPLE TITLE]',
    // TODO: Karl-Fredrik to fill in — write this in your own voice. See portfolio plan for guidance.
    body: '[Karl-Fredrik to fill in — write this in your own voice. See portfolio plan for guidance.]',
  },
  {
    title: '[PRINCIPLE TITLE]',
    // TODO: Karl-Fredrik to fill in — write this in your own voice. See portfolio plan for guidance.
    body: '[Karl-Fredrik to fill in — write this in your own voice. See portfolio plan for guidance.]',
  },
]

export default function HowIWork() {
  const ref = useRef(null)
  useFadeIn(ref)

  return (
    <section className={styles.section} aria-label="How I work">
      <div className="container" ref={ref}>
        <p className={`${styles.label} fade-up`}>Approach</p>
        <h2 className={`${styles.heading} fade-up`}>How I work</h2>
        <div className={styles.grid}>
          {PRINCIPLES.map((p, i) => (
            <div
              key={i}
              className={`${styles.card} fade-up`}
            >
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardBody}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
