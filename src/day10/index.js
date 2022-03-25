import run from "aocrunner"

const re = /position=< *(-?\d+), *(-?\d+)> velocity=< *(-?\d+), *(-?\d+)>/
const parseLine = l => l.match(re).slice(1).map(x => +x)
const parseInput = rawInput => rawInput.split('\n').map(parseLine)

const part1 = (rawInput) => {
  var pos = parseInput(rawInput)

  var seen = false
  for(var i = 0; i < 100000; i++) {
    var maxX = Number.MIN_VALUE
    var minX = Number.MAX_VALUE
    var maxY = Number.MIN_VALUE
    var minY = Number.MAX_VALUE
    const step = input => {
      return input.map(([px, py, vx, vy]) => {
        maxX = Math.max(maxX, px+vx)
        minX = Math.min(minX, px+vx)
        maxY = Math.max(maxY, py+vy)
        minY = Math.min(minY, py+vy)
        return [px + vx, py + vy, vx, vy]
      })
    }
    pos = step(pos)

    if (maxY - minY <= 10 && maxX - minX < 1000) {
      seen = true
      const grid = [...Array(maxY-minY+1)].map(_ => Array(maxX-minX+1).fill(false))

      pos.forEach(([x, y]) => {
        grid[y-minY][x-minX] = true
      })

      console.log(grid.map(l => l.map(x => x ? '█' : ' ').join('')).join('\n'));
      console.log();
    } else if (seen) {
      return 'XPFXXXKL'
    }
  }
}

const part2 = (rawInput) => {
  var pos = parseInput(rawInput)

}

run({
  part1: {
    solution: part1,
  },
  part2: {
    solution: part2,
  },
})
