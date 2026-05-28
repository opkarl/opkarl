import Cell from './Cell';
import { CellType } from './CellType';
import styles from './Grid.module.css';

export default function Grid({ cells, onCellMouseDown, onCellMouseEnter }) {
  return (
    <div className={styles.grid} onContextMenu={e => e.preventDefault()}>
      {cells.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex' }}>
          {row.map((cell, colIndex) => (
            <Cell
              key={colIndex}
              type={cell.type}
              draggable={cell.type === CellType.START || cell.type === CellType.END}
              onMouseDown={() => onCellMouseDown(rowIndex, colIndex)}
              onMouseEnter={() => onCellMouseEnter(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
