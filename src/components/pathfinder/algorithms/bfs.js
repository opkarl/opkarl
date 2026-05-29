import { CellType } from '../CellType'
import { reconstructPath } from './utils'

export function bfs(grid, start, end) {
  const rows = grid.length
  const cols = grid[0].length
  const key = (r, c) => `${r},${c}`

  const visited = []
  const seen = new Set([key(start.row, start.col)])
  const cameFrom = {}
  const queue = [start]

  while (queue.length) {
    const { row, col } = queue.shift()
    visited.push({ row, col })

    if (row === end.row && col === end.col)
      return { visited, path: reconstructPath(cameFrom, start, end) }

    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nr = row + dr
      const nc = col + dc
      const k = key(nr, nc)
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
        && !seen.has(k)
        && grid[nr][nc].type !== CellType.WALL) {
        seen.add(k)
        cameFrom[k] = { row, col }
        queue.push({ row: nr, col: nc })
      }
    }
  }

  return { visited, path: [] }
}
