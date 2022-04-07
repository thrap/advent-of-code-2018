import run from "aocrunner"
const abs = Math.abs

const parseInput = rawInput => rawInput.split('\n').map(l => l.split(',').map(x => +x))

const part1 = (rawInput) => {
  const points = parseInput(rawInput)

  const reaches = {}
  points.forEach(point => {
    const [x0, y0, z0, k0] = point
    const inRange = ([x, y, z, k]) => abs(x-x0) + abs(y-y0) + abs(z-z0) + abs(k-k0) <= 3
    reaches[point] = points.filter(inRange)
  })

  const added = {}
  const add = point => {
    if (added[point]) return
    added[point] = true
    reaches[point].forEach(add)
  }
  const group = (point) => {
    if (added[point]) return false
    add(point)
    return true
  }

  return points.filter(group).length
}

run({
  part1: {
    solution: part1,
  },
})
