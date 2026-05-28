import { useState, useEffect, useRef } from 'react';
import Grid from './Grid';
import styles from './Pathfinder.module.css';
import { CellType } from './CellType';
import { astar } from './algorithms/astar';
import { random } from './algorithms/random';
import { bfs } from './algorithms/bfs';
import { dfs } from './algorithms/dfs';

const ROWS = 8;
const COLS = 25;
const VISIT_DELAY = 20;
const PATH_DELAY = 40;

const ALGORITHM_MAP = { 'A*': astar, 'Random': random, 'BFS': bfs, 'DFS': dfs };
const ALGORITHMS = Object.keys(ALGORITHM_MAP);

function initGrid(rows, cols) {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      if (r === 0 && c === 0) return { type: CellType.START };
      if (r === rows - 1 && c === cols - 1) return { type: CellType.END };
      return { type: CellType.EMPTY };
    })
  );
}

function findNode(grid, type) {
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[r].length; c++)
      if (grid[r][c].type === type) return { row: r, col: c };
  return null;
}

export default function Pathfinder() {
  const [cells, setCells] = useState(() => initGrid(ROWS, COLS));
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('A*');
  const [isRunning, setIsRunning] = useState(false);

  // Refs avoid stale closures in mouse handlers during rapid pointer events
  // mode: 'wall' | 'erase' | null   node: 'start' | 'end' | null
  const drag = useRef({ active: false, mode: null, node: null });

  useEffect(() => {
    const release = () => { drag.current = { active: false, mode: null, node: null }; };
    window.addEventListener('mouseup', release);
    return () => window.removeEventListener('mouseup', release);
  }, []);

  function handleCellMouseDown(row, col) {
    if (isRunning) return;
    setCells(prev => {
      const type = prev[row][col].type;
      if (type === CellType.START) {
        drag.current = { active: true, mode: null, node: 'start' };
        return prev;
      }
      if (type === CellType.END) {
        drag.current = { active: true, mode: null, node: 'end' };
        return prev;
      }
      if (type === CellType.WALL) {
        drag.current = { active: true, mode: 'erase', node: null };
        return prev.map((r, ri) =>
          r.map((cell, ci) => ri === row && ci === col ? { ...cell, type: CellType.EMPTY } : cell)
        );
      }
      drag.current = { active: true, mode: 'wall', node: null };
      return prev.map((r, ri) =>
        r.map((cell, ci) => ri === row && ci === col ? { ...cell, type: CellType.WALL } : cell)
      );
    });
  }

  function handleCellMouseEnter(row, col) {
    if (!drag.current.active || isRunning) return;
    const { mode, node } = drag.current;

    if (node) {
      const nodeType = node === 'start' ? CellType.START : CellType.END;
      setCells(prev => {
        const targetType = prev[row][col].type;
        if (targetType === CellType.START || targetType === CellType.END || targetType === CellType.WALL)
          return prev;
        let nr = -1, nc = -1;
        outer: for (let r = 0; r < prev.length; r++)
          for (let c = 0; c < prev[r].length; c++)
            if (prev[r][c].type === nodeType) { nr = r; nc = c; break outer; }
        if (nr === -1 || (nr === row && nc === col)) return prev;
        return prev.map((r, ri) =>
          r.map((cell, ci) => {
            if (ri === nr && ci === nc) return { ...cell, type: CellType.EMPTY };
            if (ri === row && ci === col) return { ...cell, type: nodeType };
            return cell;
          })
        );
      });
      return;
    }

    setCells(prev => {
      const type = prev[row][col].type;
      if (mode === 'wall' && type !== CellType.EMPTY) return prev;
      if (mode === 'erase' && type !== CellType.WALL) return prev;
      const next = mode === 'wall' ? CellType.WALL : CellType.EMPTY;
      return prev.map((r, ri) =>
        r.map((cell, ci) => ri === row && ci === col ? { ...cell, type: next } : cell)
      );
    });
  }

  function handleRun() {
    if (isRunning) return;

    const cleanGrid = cells.map(r =>
      r.map(cell =>
        cell.type === CellType.VISITED || cell.type === CellType.PATH
          ? { ...cell, type: CellType.EMPTY }
          : cell
      )
    );

    const start = findNode(cleanGrid, CellType.START);
    const end = findNode(cleanGrid, CellType.END);
    if (!start || !end) return;

    const { visited, path } = ALGORITHM_MAP[selectedAlgorithm](cleanGrid, start, end);

    setCells(cleanGrid);
    setIsRunning(true);

    visited.forEach(({ row, col }, i) => {
      setTimeout(() => {
        if (cleanGrid[row][col].type !== CellType.START && cleanGrid[row][col].type !== CellType.END)
          setCells(prev => prev.map((r, ri) =>
            r.map((cell, ci) => ri === row && ci === col ? { ...cell, type: CellType.VISITED } : cell)
          ));
      }, i * VISIT_DELAY);
    });

    path.forEach(({ row, col }, i) => {
      setTimeout(() => {
        if (cleanGrid[row][col].type !== CellType.START && cleanGrid[row][col].type !== CellType.END)
          setCells(prev => prev.map((r, ri) =>
            r.map((cell, ci) => ri === row && ci === col ? { ...cell, type: CellType.PATH } : cell)
          ));
        if (i === path.length - 1) setIsRunning(false);
      }, visited.length * VISIT_DELAY + i * PATH_DELAY);
    });

    if (path.length === 0) setIsRunning(false);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <button className={styles.startBtn} onClick={handleRun} disabled={isRunning}>
          {isRunning ? 'Running…' : 'Start'}
        </button>
        <button className={styles.resetBtn} onClick={() => setCells(initGrid(ROWS, COLS))} disabled={isRunning}>
          Reset
        </button>
      </div>
      <Grid
        cells={cells}
        onCellMouseDown={handleCellMouseDown}
        onCellMouseEnter={handleCellMouseEnter}
      />
      <div className={styles.controls}>
        {ALGORITHMS.map(algo => (
          <button
            key={algo}
            className={`${styles.btn} ${selectedAlgorithm === algo ? styles.active : ''}`}
            onClick={() => setSelectedAlgorithm(algo)}
          >
            {algo}
          </button>
        ))}
      </div>
    </div>
  );
}
