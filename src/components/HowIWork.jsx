import { useRef } from 'react'
import { useFadeIn } from '../hooks/useFadeIn'
import styles from './HowIWork.module.css'

const PRINCIPLES = [
  { title: '[PRINCIPLE TITLE]', description: 'description' },
  { title: '[PRINCIPLE TITLE]', description: 'description' },
  { title: '[PRINCIPLE TITLE]', description: 'description' },
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
          {PRINCIPLES.map((p) => (
            <div
              key={p.title}
              className={`${styles.card} fade-up`}
            >
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardBody}>{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
