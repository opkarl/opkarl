import answerWordsRaw from './words/answerWords.txt?raw'
import allWordsRaw from './words/allWords.txt?raw'

const parse = raw => raw.trim().split('\n').map(w => w.trim().toLowerCase()).filter(w => w.length === 5)

// 2315 words — the possible answers (candidates list)
export const ANSWER_WORDS = parse(answerWordsRaw)

// 12 971 words — full dictionary used by minimax to find optimal guesses
export const ALL_WORDS = parse(allWordsRaw)
