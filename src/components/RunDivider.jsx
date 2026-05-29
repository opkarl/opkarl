import styles from './SportDivider.module.css'
import { useVisible } from '../hooks/useVisible'

export default function RunDivider() {
  const [ref, visible] = useVisible()

  return (
    <div
      ref={ref}
      className={`${styles.divider} ${visible ? styles.visible : ''}`}
      aria-label="Run section divider"
      role="img"
    >
      <svg className={styles.svg} viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" fill="none">
        <g className={styles.runnerGroup}>
          <circle cx="65" cy="14" r="8" fill="#1d9e75" />
          <line x1="65" y1="22" x2="62" y2="48" stroke="#1d9e75" strokeWidth="4" strokeLinecap="round" />

          <g className={styles.runArmBack}>
            <line x1="65" y1="28" x2="50" y2="38" stroke="#1d9e75" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="38" x2="44" y2="34" stroke="#1d9e75" strokeWidth="3" strokeLinecap="round" />
          </g>

          <g className={styles.runArmFront}>
            <line x1="65" y1="28" x2="78" y2="35" stroke="#1d9e75" strokeWidth="3" strokeLinecap="round" />
            <line x1="78" y1="35" x2="84" y2="30" stroke="#1d9e75" strokeWidth="3" strokeLinecap="round" />
          </g>

          <g className={styles.runLegBack}>
            <line x1="62" y1="48" x2="50" y2="64" stroke="#1d9e75" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="50" y1="64" x2="42" y2="76" stroke="#1d9e75" strokeWidth="3.5" strokeLinecap="round" />
          </g>

          <g className={styles.runLegFront}>
            <line x1="62" y1="48" x2="74" y2="60" stroke="#1d9e75" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="74" y1="60" x2="80" y2="74" stroke="#1d9e75" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        </g>

        <line x1="0" y1="78" x2="120" y2="78" stroke="#222" strokeWidth="1" />
      </svg>
    </div>
  )
}
