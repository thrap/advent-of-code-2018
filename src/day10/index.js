import run from "aocrunner"

const re = /position=< *(-?\d+), *(-?\d+)> velocity=< *(-?\d+), *(-?\d+)>/
const parseLine = l => l.match(re).slice(1).map(x => +x)
const parseInput = rawInput => rawInput.split('\n').map(parseLine)

const message = input => {
  var pos = parseInput(input)

  for(var steps = 1; steps < 100000; steps++) {
    var maxX = Number.MIN_VALUE
    var minX = Number.MAX_VALUE
    var maxY = Number.MIN_VALUE
    var minY = Number.MAX_VALUE
    pos = pos.map(([px, py, vx, vy]) => {
      maxX = Math.max(maxX, px+vx)
      minX = Math.min(minX, px+vx)
      maxY = Math.max(maxY, py+vy)
      minY = Math.min(minY, py+vy)
      return [px + vx, py + vy, vx, vy]
    })

    if (maxY - minY <= 10 && maxX - minX < 1000) {
      const grid = [...Array(maxY-minY+1)].map(_ => Array(maxX-minX+1).fill(false))

      pos.forEach(([x, y]) => {
        grid[y-minY][x-minX] = true
      })

      console.log(grid.map(l => l.map(x => x ? '█' : ' ').join('')).join('\n'));
      return steps
    }
  }
}

run({
  part1: {
    solution: () => 'XPFXXXKL',
  },
  part2: {
    solution: input => message(input),
  },
})
