const WORD_LEN = 5;
const MINIMAX_SWITCH = 100;
const DUPLICATE_LETTER_PENALTY = 200;

function pow3(k) {
  let r = 1;
  for (let i = 0; i < k; i++) r *= 3;
  return r;
}

export const CORRECT_CODE = pow3(WORD_LEN) - 1; // 242 — all greens

// Direct port of MyStrategy.fastPatternCode — base-3 encodes feedback digits
export function fastPatternCode(guess, answer) {
  const digits = new Int8Array(WORD_LEN);
  const freq = new Int8Array(26);

  for (let i = 0; i < WORD_LEN; i++) {
    if (guess[i] === answer[i]) {
      digits[i] = 2; // CORRECT
    } else {
      freq[answer.charCodeAt(i) - 97]++;
    }
  }

  for (let i = 0; i < WORD_LEN; i++) {
    if (digits[i] !== 0) continue;
    const gi = guess.charCodeAt(i) - 97;
    if (freq[gi] > 0) {
      digits[i] = 1; // MISPLACED
      freq[gi]--;
    }
  }

  let code = 0, mul = 1;
  for (let i = 0; i < WORD_LEN; i++) {
    code += digits[i] * mul;
    mul *= 3;
  }
  return code;
}

// Returns [{letter, type}] — types: 'correct' | 'misplaced' | 'wrong'
export function getFeedback(guess, answer) {
  const types = new Array(WORD_LEN).fill('wrong');
  const freq = new Int8Array(26);

  for (let i = 0; i < WORD_LEN; i++) {
    if (guess[i] === answer[i]) {
      types[i] = 'correct';
    } else {
      freq[answer.charCodeAt(i) - 97]++;
    }
  }

  for (let i = 0; i < WORD_LEN; i++) {
    if (types[i] !== 'wrong') continue;
    const gi = guess.charCodeAt(i) - 97;
    if (freq[gi] > 0) {
      types[i] = 'misplaced';
      freq[gi]--;
    }
  }

  return guess.split('').map((letter, i) => ({ letter, type: types[i] }));
}

export function eliminateWords(candidates, guess, patternCode) {
  return candidates.filter(w => fastPatternCode(guess, w) === patternCode);
}

export function createFrequencyMap(answers) {
  const freq = Array.from({ length: WORD_LEN }, () => new Map());
  for (const word of answers) {
    for (let i = 0; i < WORD_LEN; i++) {
      const c = word[i];
      freq[i].set(c, (freq[i].get(c) || 0) + 1);
    }
  }
  return freq;
}

function chooseByHeatmap(candidates, freq, illegalChars, usedChars) {
  let best = null;
  let bestScore = -Infinity;

  for (const word of candidates) {
    let score = 0;
    let mask = 0;
    let skip = false;

    for (let i = 0; i < WORD_LEN; i++) {
      const c = word[i];
      if (illegalChars.has(c)) { skip = true; break; }

      const contrib = freq[i].get(c) || 0;
      score += contrib;

      const bit = 1 << (c.charCodeAt(0) - 97);
      if (mask & bit) {
        score -= (contrib + DUPLICATE_LETTER_PENALTY);
      } else {
        mask |= bit;
      }

      if (usedChars.has(c)) score -= 100;
    }

    if (skip) continue;

    // popcount bonus (unique letter diversity)
    let m = mask;
    while (m) { score++; m &= (m - 1); }

    if (score > bestScore) {
      bestScore = score;
      best = word;
    }
  }

  return best;
}

function chooseByMinimaxPartition(candidates, allWords) {
  const patternCount = pow3(WORD_LEN);
  let bestGuess = null;
  let bestWorst = Infinity;
  let bestTie = Infinity;

  for (const guess of allWords) {
    const buckets = new Int32Array(patternCount);
    for (const ans of candidates) {
      buckets[fastPatternCode(guess, ans)]++;
    }

    let worst = 0;
    let sumSq = 0;
    for (let i = 0; i < patternCount; i++) {
      const s = buckets[i];
      if (s > worst) worst = s;
      sumSq += s * s;
    }

    if (worst < bestWorst || (worst === bestWorst && sumSq < bestTie)) {
      bestWorst = worst;
      bestTie = sumSq;
      bestGuess = guess;
      if (bestWorst === 1) break;
    }
  }

  return bestGuess || candidates[0];
}

// Returns a candidate word that perfectly partitions the pool (worst-case bucket = 1),
// guaranteeing the next guess will be the answer. Only checks candidate words, not allWords.
function findPerfectSeparator(candidates) {
  const patternCount = pow3(WORD_LEN);
  for (const guess of candidates) {
    const buckets = new Int32Array(patternCount);
    for (const ans of candidates) {
      buckets[fastPatternCode(guess, ans)]++;
    }
    let worst = 0;
    for (let i = 0; i < patternCount; i++) {
      if (buckets[i] > worst) worst = buckets[i];
    }
    if (worst === 1) return guess;
  }
  return null;
}

export function chooseGuess(candidates, allWords, freq, illegalChars, usedChars, isFirst, bestStartWord) {
  if (candidates.length === 1) return candidates[0];

  if (candidates.length < 10) {
    const perfect = findPerfectSeparator(candidates);
    if (perfect) return perfect;
  }

  if (candidates.length > MINIMAX_SWITCH) {
    if (isFirst && bestStartWord) return bestStartWord;
    return chooseByHeatmap(candidates, freq, illegalChars, usedChars)
      || chooseByMinimaxPartition(candidates, allWords);
  }

  return chooseByMinimaxPartition(candidates, allWords);
}
