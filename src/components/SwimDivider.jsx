import styles from './SportDivider.module.css'
import { useVisible } from '../hooks/useVisible'

export default function SwimDivider() {
  const [ref, visible] = useVisible()

  return (
    <div
      ref={ref}
      className={`${styles.divider} ${visible ? styles.visible : ''}`}
      aria-label="Swim section divider"
      role="img"
    >
      <svg className={styles.svg} viewBox="0 0 220 80" xmlns="http://www.w3.org/2000/svg" fill="none">
        {/* Water surface */}
        <line x1="0" y1="52" x2="220" y2="52" stroke="#1d9e75" strokeWidth="1" opacity="0.35" />
        <path d="M15,52 Q25,48 35,52 Q45,56 55,52" fill="none" stroke="#1d9e75" strokeWidth="1" opacity="0.25" />
        <path d="M75,52 Q85,48 95,52 Q105,56 115,52" fill="none" stroke="#1d9e75" strokeWidth="1" opacity="0.2" />
        <path d="M168,52 Q178,48 188,52 Q198,56 208,52" fill="none" stroke="#1d9e75" strokeWidth="1" opacity="0.18" />

        <g className={styles.swimBody}>
          {/* Head — bottom edge touches shoulder */}
          <circle cx="155" cy="44" r="8" fill="#1d9e75" />

          {/* Torso — shoulder at (147,48), hip at (72,52) */}
          <line x1="147" y1="48" x2="72" y2="52" stroke="#1d9e75" strokeWidth="5" strokeLinecap="round" />

          {/* Arm A — rotates full 360° around shoulder (147,48).
              Tip starts forward-down (water entry). fill-box 0% 0% = (147,48). */}
          <g className={styles.swimArmA}>
            <line x1="147" y1="48" x2="180" y2="67" stroke="#1d9e75" strokeWidth="3.5" strokeLinecap="round" />
          </g>

          {/* Arm B — identical geometry, 180° out of phase = recovery position at t=0 */}
          <g className={styles.swimArmB}>
            <line x1="147" y1="48" x2="180" y2="67" stroke="#1d9e75" strokeWidth="3.5" strokeLinecap="round" />
          </g>

          {/* Leg A — flutter up, pivots from hip (72,52) */}
          <g className={styles.swimLegUp}>
            <line x1="72" y1="52" x2="50" y2="44" stroke="#1d9e75" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="50" y1="44" x2="36" y2="42" stroke="#1d9e75" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Leg B — flutter down */}
          <g className={styles.swimLegDown}>
            <line x1="72" y1="52" x2="52" y2="60" stroke="#1d9e75" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="52" y1="60" x2="38" y2="63" stroke="#1d9e75" strokeWidth="3" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  )
}
