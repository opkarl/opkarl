import { useState, useRef } from 'react'
import styles from './WordleSolver.module.css'
import { ANSWER_WORDS, ALL_WORDS } from './wordleWords'
import {
  fastPatternCode,
  getFeedback,
  eliminateWords,
  createFrequencyMap,
  chooseGuess,
  CORRECT_CODE,
} from './solverEngine'

const MAX_GUESSES = 6
const WORD_LEN = 5
const AUTO_DELAY = 900
const WORD_DISPLAY_LIMIT = 30
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')

function randomWord() {
  return ANSWER_WORDS[Math.floor(Math.random() * ANSWER_WORDS.length)]
}

function emptyGrid() {
  return Array.from({ length: MAX_GUESSES }, () =>
    Array.from({ length: WORD_LEN }, () => ({ letter: '', type: 'empty' }))
  )
}

function buildSolver(target) {
  return {
    target,
    candidates: [...ANSWER_WORDS],
    illegalChars: new Set(),
    usedChars: new Set(),
    freq: createFrequencyMap(ANSWER_WORDS),
    isFirst: true,
    guessCount: 0,
    done: false,
  }
}

// Derive per-letter state from filled grid rows — correct > misplaced > wrong priority
function getLetterStates(grid) {
  const states = {}
  const priority = { correct: 3, misplaced: 2, wrong: 1 }
  for (const row of grid) {
    for (const { letter, type } of row) {
      if (!letter || type === 'empty') continue
      if (!states[letter] || priority[type] > priority[states[letter]]) {
        states[letter] = type
      }
    }
  }
  return states
}

export default function WordleSolver() {
  const solverRef = useRef(buildSolver(randomWord()))
  const isRunningRef = useRef(false)
  const timerRef = useRef(null)
  const replayTimersRef = useRef([])
  const bestStartRef = useRef(null)

  // shared
  const [mode, setMode] = useState('solver')
  const [grid, setGrid] = useState(emptyGrid)
  const [candidates, setCandidates] = useState(ANSWER_WORDS)
  const [targetDisplay, setTargetDisplay] = useState(() => solverRef.current.target.toUpperCase())
  const [targetInput, setTargetInput] = useState('')
  const [targetInputError, setTargetInputError] = useState(false)

  // solver mode
  const [isRunning, setIsRunning] = useState(false)
  const [solverDone, setSolverDone] = useState(false)
  const [solverMsg, setSolverMsg] = useState('')

  // challenge mode
  const [phase, setPhase] = useState('user') // 'user' | 'ai-replay' | 'done'
  const [guessInput, setGuessInput] = useState('')
  const [guessError, setGuessError] = useState(false)
  const [userResult, setUserResult] = useState(null)
  const [aiResult, setAiResult] = useState(null)

  // ── Shared helpers ────────────────────────────────────────

  function clearTimer() {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
  }

  function clearReplayTimers() {
    replayTimersRef.current.forEach(clearTimeout)
    replayTimersRef.current = []
  }

  function handleReset(keepTarget) {
    clearTimer()
    clearReplayTimers()
    isRunningRef.current = false

    const target = keepTarget || randomWord()
    solverRef.current = buildSolver(target)
    setGrid(emptyGrid())
    setCandidates(ANSWER_WORDS)
    setTargetDisplay(target.toUpperCase())

    setIsRunning(false)
    setSolverDone(false)
    setSolverMsg('')

    setPhase('user')
    setGuessInput('')
    setUserResult(null)
    setAiResult(null)
  }

  function handleModeChange(next) {
    if (next === mode) return
    setMode(next)
    handleReset(solverRef.current.target)
  }

  function handleTargetSubmit(e) {
    e.preventDefault()
    const word = targetInput.trim().toLowerCase()
    if (word.length === WORD_LEN && ALL_WORDS.includes(word)) {
      handleReset(word)
      setTargetInput('')
    } else {
      setTargetInputError(true)
      setTimeout(() => setTargetInputError(false), 500)
    }
  }

  // ── Solver mode ───────────────────────────────────────────

  function doStep() {
    const s = solverRef.current
    if (!s || s.done || s.guessCount >= MAX_GUESSES) return false

    const guess = chooseGuess(
      s.candidates, ALL_WORDS, s.freq,
      s.illegalChars, s.usedChars, s.isFirst, bestStartRef.current
    )
    if (!bestStartRef.current) bestStartRef.current = guess
    s.isFirst = false

    const tiles = getFeedback(guess, s.target)
    const code = fastPatternCode(guess, s.target)

    for (const { letter, type } of tiles) {
      if (type === 'wrong') s.illegalChars.add(letter)
      s.usedChars.add(letter)
    }

    const newCandidates = eliminateWords(s.candidates, guess, code)
    s.candidates = newCandidates
    s.freq = createFrequencyMap(newCandidates)

    const row = s.guessCount++
    const solved = code === CORRECT_CODE
    const failed = s.guessCount >= MAX_GUESSES && !solved
    s.done = solved || failed

    setGrid(prev => prev.map((r, ri) => ri === row ? tiles : r))
    setCandidates(newCandidates)

    if (s.done) {
      setSolverMsg(solved ? `Solved in ${s.guessCount}!` : `Failed — was ${s.target.toUpperCase()}`)
      setSolverDone(true)
      isRunningRef.current = false
      setIsRunning(false)
    }
    return !s.done
  }

  function scheduleNext() {
    timerRef.current = setTimeout(() => {
      if (!isRunningRef.current) return
      const more = doStep()
      if (more && isRunningRef.current) scheduleNext()
    }, AUTO_DELAY)
  }

  function handlePlay() {
    if (solverDone || isRunningRef.current) return
    isRunningRef.current = true
    setIsRunning(true)
    scheduleNext()
  }

  function handlePause() {
    clearTimer()
    isRunningRef.current = false
    setIsRunning(false)
  }

  function handleStep() {
    if (isRunningRef.current || solverDone) return
    doStep()
  }

  // ── Challenge mode ────────────────────────────────────────

  // Returns { rows: tiles[][], candidateSnapshots: string[][] }
  function computeAISolution(target) {
    let cands = [...ANSWER_WORDS]
    const illegalChars = new Set()
    const usedChars = new Set()
    let freq = createFrequencyMap(ANSWER_WORDS)
    let isFirst = true
    const rows = []
    const candidateSnapshots = []

    for (let i = 0; i < MAX_GUESSES; i++) {
      if (!cands.length) break
      const guess = chooseGuess(cands, ALL_WORDS, freq, illegalChars, usedChars, isFirst, bestStartRef.current)
      if (!bestStartRef.current) bestStartRef.current = guess
      isFirst = false

      const tiles = getFeedback(guess, target)
      const code = fastPatternCode(guess, target)

      for (const { letter, type } of tiles) {
        if (type === 'wrong') illegalChars.add(letter)
        usedChars.add(letter)
      }
      cands = eliminateWords(cands, guess, code)
      freq = createFrequencyMap(cands)
      rows.push(tiles)
      candidateSnapshots.push(cands)
      if (code === CORRECT_CODE) break
    }
    return { rows, candidateSnapshots }
  }

  function startAIReplay({ rows, candidateSnapshots }) {
    setPhase('ai-replay')
    setGrid(emptyGrid())
    setCandidates(ANSWER_WORDS)

    replayTimersRef.current = rows.map((tiles, i) =>
      setTimeout(() => {
        setGrid(prev => prev.map((r, ri) => ri === i ? tiles : r))
        setCandidates(candidateSnapshots[i])
        if (i === rows.length - 1) {
          const solved = tiles.every(t => t.type === 'correct')
          setAiResult({ guesses: rows.length, solved })
          setPhase('done')
        }
      }, (i + 1) * AUTO_DELAY)
    )
  }

  function handleUserGuess(e) {
    e.preventDefault()
    const word = guessInput.trim().toLowerCase()
    if (word.length !== WORD_LEN || !ALL_WORDS.includes(word)) {
      setGuessError(true)
      setTimeout(() => setGuessError(false), 500)
      return
    }

    const s = solverRef.current
    if (s.guessCount >= MAX_GUESSES) return

    const tiles = getFeedback(word, s.target)
    const code = fastPatternCode(word, s.target)
    const row = s.guessCount++

    for (const { letter, type } of tiles) {
      if (type === 'wrong') s.illegalChars.add(letter)
      s.usedChars.add(letter)
    }
    s.candidates = eliminateWords(s.candidates, word, code)

    setGrid(prev => prev.map((r, ri) => ri === row ? tiles : r))
    setCandidates(s.candidates)
    setGuessInput('')

    const solved = code === CORRECT_CODE
    const failed = s.guessCount >= MAX_GUESSES && !solved

    if (solved || failed) {
      setUserResult({ guesses: s.guessCount, solved })
      const aiSolution = computeAISolution(s.target)
      setTimeout(() => startAIReplay(aiSolution), 700)
    }
  }

  // ── Info strip ────────────────────────────────────────────

  function renderInfo() {
    if (mode === 'solver') {
      if (solverDone) return (
        <span className={solverMsg.startsWith('Solved') ? styles.solved : styles.failed}>
          {solverMsg}
        </span>
      )
      return (
        <span className={styles.candidateLabel}>target: <span className={styles.targetWord}>{targetDisplay}</span></span>
      )
    }

    if (phase === 'user') return (
      <span className={styles.candidateLabel}>your turn</span>
    )

    if (phase === 'ai-replay') return (
      <>
        {userResult && (
          <span className={userResult.solved ? styles.solved : styles.failed}>
            you: {userResult.solved ? userResult.guesses : '✗'}
          </span>
        )}
        <span className={styles.candidateLabel}> · ai solving…</span>
      </>
    )

    if (userResult && aiResult) {
      const youBetter = userResult.solved && (!aiResult.solved || userResult.guesses < aiResult.guesses)
      const tie = userResult.solved && aiResult.solved && userResult.guesses === aiResult.guesses
      return (
        <>
          <span className={youBetter || tie ? styles.solved : styles.failed}>
            you: {userResult.solved ? userResult.guesses : '✗'}
          </span>
          <span className={styles.candidateLabel}> · </span>
          <span className={!youBetter && !tie ? styles.solved : styles.failed}>
            ai: {aiResult.solved ? aiResult.guesses : '✗'}
          </span>
          <span className={styles.candidateLabel}> guesses · {targetDisplay}</span>
        </>
      )
    }
    return null
  }

  // ── Derived display values ────────────────────────────────

  const letterStates = getLetterStates(grid)
  const replayInProgress = mode === 'challenge' && phase === 'ai-replay'
  const displayedWords = candidates.slice(0, WORD_DISPLAY_LIMIT)
  const overflow = candidates.length - WORD_DISPLAY_LIMIT

  return (
    <div className={styles.wrapper}>

      {/* Mode toggle */}
      <div className={styles.modeToggle}>
        <button
          className={`${styles.modeBtn} ${mode === 'solver' ? styles.modeBtnActive : ''}`}
          onClick={() => handleModeChange('solver')}
        >
          Solver
        </button>
        <button
          className={`${styles.modeBtn} ${mode === 'challenge' ? styles.modeBtnActive : ''}`}
          onClick={() => handleModeChange('challenge')}
        >
          Challenge
        </button>
      </div>

      {/* Controls */}
      <div className={styles.topBar}>
        {mode === 'solver' && (isRunning
          ? <button className={styles.primaryBtn} onClick={handlePause}>Pause</button>
          : <button className={styles.primaryBtn} onClick={handlePlay} disabled={solverDone}>Play</button>
        )}
        {mode === 'solver' && (
          <button className={styles.secondaryBtn} onClick={handleStep} disabled={isRunning || solverDone}>
            Step
          </button>
        )}
        <button className={styles.secondaryBtn} onClick={() => handleReset()} disabled={replayInProgress}>
          New
        </button>
      </div>

      {/* Board area: word list + grid + alphabet */}
      <div className={styles.boardArea}>

        {/* Left: possible words */}
        <div className={styles.wordList}>
          <div className={styles.wordListHeader}>
            <span className={styles.candidateCount}>{candidates.length}</span>
            <span className={styles.wordListLabel}> words</span>
          </div>
          {displayedWords.map((w, i) => (
            <div key={i} className={styles.wordListItem}>{w}</div>
          ))}
          {overflow > 0 && (
            <div className={styles.wordListMore}>+{overflow} more</div>
          )}
        </div>

        {/* Centre: grid */}
        <div className={styles.grid}>
          {grid.map((row, ri) => (
            <div key={ri} className={styles.row}>
              {row.map((tile, ci) => (
                <div key={ci} className={styles.tile} data-state={tile.type}>
                  {tile.letter.toUpperCase()}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Right: alphabet */}
        <div className={styles.alphabetPanel}>
          <div className={styles.alphabet}>
            {ALPHABET.map(letter => (
              <div
                key={letter}
                className={styles.alphLetter}
                data-state={letterStates[letter] || 'unknown'}
              >
                {letter.toUpperCase()}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Info strip */}
      <div className={styles.info}>{renderInfo()}</div>

      {/* Challenge guess input */}
      {mode === 'challenge' && phase === 'user' && (
        <form className={styles.inputRow} onSubmit={handleUserGuess}>
          <input
            className={`${styles.input} ${guessError ? styles.inputError : ''}`}
            type="text"
            placeholder="your guess…"
            value={guessInput}
            onChange={e => setGuessInput(e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 5))}
            maxLength={5}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
          />
          <button type="submit" className={styles.primaryBtn}>Guess</button>
        </form>
      )}

      {/* Set target — solver mode only */}
      {mode === 'solver' && (
        <form className={styles.inputRow} onSubmit={handleTargetSubmit}>
          <input
            className={`${styles.input} ${targetInputError ? styles.inputError : ''}`}
            type="text"
            placeholder="set target…"
            value={targetInput}
            onChange={e => setTargetInput(e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 5))}
            maxLength={5}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
          />
          <button type="submit" className={styles.secondaryBtn}>Set</button>
        </form>
      )}

    </div>
  )
}
