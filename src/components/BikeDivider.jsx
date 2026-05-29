import styles from './SportDivider.module.css'
import { useVisible } from '../hooks/useVisible'

export default function BikeDivider() {
  const [ref, visible] = useVisible()

  return (
    <div
      ref={ref}
      className={`${styles.divider} ${visible ? styles.visible : ''}`}
      aria-label="Bike section divider"
      role="img"
    >
      <svg className={styles.svg} viewBox="0 0 200 90" xmlns="http://www.w3.org/2000/svg" fill="none">
        {/* Rear wheel */}
        <circle cx="50" cy="65" r="22" stroke="#1d9e75" strokeWidth="2" />
        <circle cx="50" cy="65" r="3" fill="#1d9e75" />
        {/* Front wheel */}
        <circle cx="150" cy="65" r="22" stroke="#1d9e75" strokeWidth="2" />
        <circle cx="150" cy="65" r="3" fill="#1d9e75" />

        {/* Frame */}
        <line x1="50" y1="65" x2="100" y2="38" stroke="#f0f0f0" strokeWidth="2" />
        <line x1="100" y1="38" x2="150" y2="65" stroke="#f0f0f0" strokeWidth="2" />
        <line x1="100" y1="38" x2="100" y2="65" stroke="#f0f0f0" strokeWidth="1.5" />
        <line x1="50" y1="65" x2="100" y2="65" stroke="#f0f0f0" strokeWidth="2" />

        {/* Seat stay + saddle */}
        <line x1="88" y1="38" x2="83" y2="22" stroke="#f0f0f0" strokeWidth="2" />
        <line x1="78" y1="20" x2="92" y2="20" stroke="#f0f0f0" strokeWidth="2.5" />

        {/* Fork + handlebar */}
        <line x1="144" y1="50" x2="147" y2="32" stroke="#f0f0f0" strokeWidth="2" />
        <line x1="143" y1="31" x2="154" y2="31" stroke="#f0f0f0" strokeWidth="2.5" />

        {/* Rider — aggressive road position, hips over saddle */}
        <line x1="86" y1="18" x2="98" y2="44" stroke="#e0e0e0" strokeWidth="3" strokeLinecap="round" />
        <line x1="86" y1="17" x2="134" y2="17" stroke="#e0e0e0" strokeWidth="3" strokeLinecap="round" />
        <line x1="132" y1="17" x2="130" y2="13" stroke="#e0e0e0" strokeWidth="2" strokeLinecap="round" />
        <circle cx="128" cy="11" r="7" fill="#e0e0e0" />
        <line x1="134" y1="17" x2="141" y2="25" stroke="#e0e0e0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="141" y1="25" x2="149" y2="31" stroke="#e0e0e0" strokeWidth="2" strokeLinecap="round" />

        {/* Crank + pedals */}
        <circle cx="100" cy="65" r="5" stroke="#1d9e75" strokeWidth="1.5" />
        <g className={styles.pedalGroup}>
          <line x1="100" y1="65" x2="110" y2="72" stroke="#1d9e75" strokeWidth="2" />
          <line x1="100" y1="65" x2="90" y2="58" stroke="#1d9e75" strokeWidth="2" />
          <line x1="108" y1="73" x2="114" y2="73" stroke="#f0f0f0" strokeWidth="2" />
          <line x1="88" y1="57" x2="94" y2="57" stroke="#f0f0f0" strokeWidth="2" />
        </g>
      </svg>
    </div>
  )
}
