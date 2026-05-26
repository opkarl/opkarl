import { useRef } from 'react'
import { useFadeIn } from '../hooks/useFadeIn'
import styles from './About.module.css'

const PILLS = [
  'Royal Norwegian Air Force',
  'Olympic tri in training',
  '3 yrs on two wheels',
  'Disc golf',
]

export default function About() {
  const ref = useRef(null)
  useFadeIn(ref)

  return (
    <section id="about" className={styles.section} aria-label="About">
      <div className="container" ref={ref}>
        <p className="fade-up">
          <span className={styles.label}>About</span>
        </p>

        <div className={`${styles.cards} fade-up`} style={{ '--stagger': '0.1s' }}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>The developer</h3>
            <p className={styles.cardBody}>
              Java and Python day-to-day. SQL when the data gets interesting. Teaching assistant in intro programming at UiB. I pull in AI tools wherever they save time, and I optimize the parts that matter.
            </p>
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>The person</h3>
            <p className={styles.cardBody}>
              Royal Norwegian Air Force. Alpine skiing. Disc golf. Training for an Olympic-distance triathlon. Three years on two wheels. Analytical by nature, outdoors by choice.
            </p>
          </div>
        </div>

        <div className={`${styles.pills} fade-up`}>
          {PILLS.map(p => (
            <span key={p} className={styles.pill}>{p}</span>
          ))}
        </div>

        <blockquote className={`${styles.quote} fade-up`}>
          <p className={styles.quoteText}>
            "Whether it&rsquo;s a split time or a load time — I want it faster."
          </p>
        </blockquote>
      </div>
    </section>
  )
}
