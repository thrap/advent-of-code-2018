import run from "aocrunner"

const re = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/
const parseLine = l => l.match(re).slice(1).map(x => +x)
const parseInput = rawInput => rawInput.split('\n').map(parseLine)

const part1 = (rawInput) => {
  const areas = parseInput(rawInput)
  const count = [...Array(1000)].map(_ => Array(1000).fill(0))

  areas.forEach(([, dx, dy, width, height]) => {
    for (var x = dx; x < dx+width; x++) {
      for (var y = dy; y < dy+height; y++) {
        count[x][y]++
      }
    }
  })

  var overlap = 0
  for (var x = 0; x < 1000; x++) {
    for (var y = 0; y < 1000; y++) {
      overlap += (count[x][y] > 1) ? 1 : 0
    }
  }
  return overlap
}

const part2 = (rawInput) => {
  const areas = parseInput(rawInput)

  const overlapLine = (a1, a2, b1, b2) => (a1 <= b2 && a1 >= b1) || (b1 <= a2 && b1 >= a1)

  const overlaps = (a, b) => {
    if (a[0] == b[0]) return false
    const x = overlapLine(a[1], a[1]+a[3]-1, b[1], b[1]+b[3]-1)
    const y = overlapLine(a[2], a[2]+a[4]-1, b[2], b[2]+b[4]-1)
    return x && y
  }

  return areas.find(a => areas.every(b => !overlaps(a, b)))[0]
}

run({
  part1: {
    solution: part1,
  },
  part2: {
    solution: part2,
  },
})
