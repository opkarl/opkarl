import { useState, useRef, useEffect } from 'react';
import styles from './SortingVisualizer.module.css';

const N = 32;
const DELAY = 6;

function makeArr() {
  const a = Array.from({ length: N }, (_, i) => i + 1);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function bubbleSteps(arr) {
  const steps = [];
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      steps.push({ bars: [...a], active: [j, j + 1] });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ bars: [...a], active: [j, j + 1] });
      }
    }
  }
  return [...steps, { bars: [...a], active: [], done: true }];
}

function insertionSteps(arr) {
  const steps = [];
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    let j = i;
    while (j > 0 && a[j - 1] > a[j]) {
      steps.push({ bars: [...a], active: [j - 1, j] });
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      steps.push({ bars: [...a], active: [j - 1, j] });
      j--;
    }
  }
  return [...steps, { bars: [...a], active: [], done: true }];
}

function quickSteps(arr) {
  const steps = [];
  const a = [...arr];

  function partition(lo, hi) {
    const pivot = a[hi];
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      steps.push({ bars: [...a], active: [j, hi] });
      if (a[j] <= pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        if (i !== j) steps.push({ bars: [...a], active: [i, j] });
      }
    }
    [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
    steps.push({ bars: [...a], active: [i + 1] });
    return i + 1;
  }

  function qs(lo, hi) {
    if (lo >= hi) return;
    const p = partition(lo, hi);
    qs(lo, p - 1);
    qs(p + 1, hi);
  }

  qs(0, a.length - 1);
  return [...steps, { bars: [...a], active: [], done: true }];
}

const ALGOS = { Bubble: bubbleSteps, Insertion: insertionSteps, Quick: quickSteps };

export default function SortingVisualizer() {
  const [bars, setBars] = useState(makeArr);
  const [active, setActive] = useState([]);
  const [isDone, setIsDone] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [algo, setAlgo] = useState('Bubble');
  const tids = useRef([]);

  useEffect(() => () => { tids.current.forEach(clearTimeout); }, []);

  function cancel() {
    tids.current.forEach(clearTimeout);
    tids.current = [];
  }

  function handleReset() {
    cancel();
    setBars(makeArr());
    setActive([]);
    setIsDone(false);
    setIsRunning(false);
  }

  function handleRun() {
    if (isRunning) return;
    const input = isDone ? makeArr() : bars;
    const steps = ALGOS[algo](input);
    setBars(input);
    setIsRunning(true);
    setIsDone(false);
    tids.current = steps.map((step, i) =>
      setTimeout(() => {
        setBars(step.bars);
        setActive(step.active);
        if (step.done) { setIsDone(true); setIsRunning(false); }
      }, i * DELAY)
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <button className={styles.startBtn} onClick={handleRun} disabled={isRunning}>
          {isRunning ? 'Sorting…' : 'Sort'}
        </button>
        <button className={styles.resetBtn} onClick={handleReset} disabled={isRunning}>
          Reset
        </button>
      </div>
      <div className={styles.bars}>
        {bars.map((val, i) => (
          <div
            key={i}
            className={styles.bar}
            style={{ height: `${(val / N) * 100}%` }}
            data-state={
              isDone        ? 'done'
              : active[0] === i ? 'a'
              : active[1] === i ? 'b'
              : undefined
            }
          />
        ))}
      </div>
      <div className={styles.controls}>
        {Object.keys(ALGOS).map(name => (
          <button
            key={name}
            className={`${styles.btn} ${algo === name ? styles.active : ''}`}
            onClick={() => !isRunning && setAlgo(name)}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
