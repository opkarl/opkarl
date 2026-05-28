import { CellType } from '../CellType';

export function random(grid, start, end) {
  const rows = grid.length;
  const cols = grid[0].length;
  const key = (r, c) => `${r},${c}`;

  const visited = [];
  const seen = new Set([key(start.row, start.col)]);
  const cameFrom = {};
  const stack = [start];

  while (stack.length) {
    const idx = Math.floor(Math.random() * stack.length);
    const { row, col } = stack.splice(idx, 1)[0];
    visited.push({ row, col });

    if (row === end.row && col === end.col)
      return { visited, path: reconstructPath(cameFrom, start, end) };

    const neighbors = [[-1, 0], [1, 0], [0, -1], [0, 1]].sort(() => Math.random() - 0.5);
    for (const [dr, dc] of neighbors) {
      const nr = row + dr;
      const nc = col + dc;
      const k = key(nr, nc);
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
        && !seen.has(k)
        && grid[nr][nc].type !== CellType.WALL) {
        seen.add(k);
        cameFrom[k] = { row, col };
        stack.push({ row: nr, col: nc });
      }
    }
  }

  return { visited, path: [] };
}

function reconstructPath(cameFrom, start, end) {
  const path = [];
  let current = end;
  while (!(current.row === start.row && current.col === start.col)) {
    path.unshift(current);
    current = cameFrom[`${current.row},${current.col}`];
    if (!current) return [];
  }
  return path;
}
