import { CellType } from '../CellType'
import { reconstructPath } from './utils'

export function astar(grid, start, end) {
  const rows = grid.length
  const cols = grid[0].length
  const key = (r, c) => `${r},${c}`
  const heuristic = (r, c) => Math.abs(r - end.row) + Math.abs(c - end.col)

  const visited = []
  const seen = new Set()
  const g = { [key(start.row, start.col)]: 0 }
  const cameFrom = {}
  const open = [{ ...start, f: heuristic(start.row, start.col), h: heuristic(start.row, start.col) }]

  while (open.length) {
    open.sort((a, b) => {
      if (a.f !== b.f) return a.f - b.f
      if (a.h !== b.h) return a.h - b.h
      // Break remaining ties by distance from the straight line start→end,
      // so exploration tracks the diagonal instead of going L-shaped.
      const crossA = Math.abs((a.row - end.row) * (start.col - end.col) - (start.row - end.row) * (a.col - end.col))
      const crossB = Math.abs((b.row - end.row) * (start.col - end.col) - (start.row - end.row) * (b.col - end.col))
      return crossA - crossB
    })
    const { row, col } = open.shift()
    const k = key(row, col)

    if (seen.has(k)) continue
    seen.add(k)
    visited.push({ row, col })

    if (row === end.row && col === end.col)
      return { visited, path: reconstructPath(cameFrom, start, end) }

    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nr = row + dr
      const nc = col + dc
      const nk = key(nr, nc)
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
        && !seen.has(nk)
        && grid[nr][nc].type !== CellType.WALL) {
        const newG = g[k] + 1
        if (g[nk] === undefined || newG < g[nk]) {
          g[nk] = newG
          cameFrom[nk] = { row, col }
          const h = heuristic(nr, nc)
          open.push({ row: nr, col: nc, f: newG + h, h })
        }
      }
    }
  }

  return { visited, path: [] }
}
