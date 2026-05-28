import styles from './Cell.module.css';
import { CellType } from './CellType';

export default function Cell({ type, draggable, onMouseDown, onMouseEnter }) {
  return (
    <button
      className={styles.cell}
      data-type={type}
      data-draggable={draggable || undefined}
      draggable={false}
      onDragStart={e => e.preventDefault()}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
    />
  );
}
