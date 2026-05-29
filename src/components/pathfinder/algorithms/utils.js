export function reconstructPath(cameFrom, start, end) {
  const path = []
  let current = end
  while (!(current.row === start.row && current.col === start.col)) {
    path.unshift(current)
    current = cameFrom[`${current.row},${current.col}`]
    if (!current) return []
  }
  return path
}
