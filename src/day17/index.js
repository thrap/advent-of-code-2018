import run from "aocrunner"

const re = /^(x|y)=(\d+), .=(\d+)\.\.(\d+)/
const parseLine = l => l.match(re).slice(1).map(x => +x ? +x : x)
const parseInput = rawInput => rawInput.split('\n').map(parseLine)

const SAND = '.'
const SPRING = '+'
const CLAY = '#'
const WATER_FALLING = '|'
const WATER_STILL = '~'

const computeGrid = (rawInput) => {
  const input = parseInput(rawInput)
  const ranges = input.map(([x, v, a, b]) => x == 'y' ? [[a,b],[v,v]] : [[v,v],[a,b]])

  var minX = Math.min(...ranges.map(r => r[0][0]))-10
  var maxX = Math.max(...ranges.map(r => r[0][1]))+10
  var minY = Math.min(...ranges.map(r => r[1][0]))
  var maxY = Math.max(...ranges.map(r => r[1][1]))

  const grid = [...Array(maxY+2)].map(_ => Array(maxX-minX).fill(SAND))
  grid[0][500-minX] = SPRING
  ranges.forEach(([[x1,x2], [y1, y2]]) => {
    for (var i = y1; i <= y2; i++) {
      for (var j = x1; j <= x2; j++) {
        grid[i][j-minX] = CLAY
      }
    }
  })

  const fillDx = (i, j, dx, c) => {
    for (var x = j; grid[i+1][x] == CLAY || grid[i+1][x] == WATER_STILL; x+=dx) {
      if (grid[i][x] == CLAY) {
        return true
      }
      grid[i][x] = c
    }

    if (grid[i][x] == SAND)
      dropWater(i, x)
  }
  const fillLeft = (i, j, c) => fillDx(i, j, -1, c)
  const fillRight = (i, j, c) => fillDx(i, j, 1, c)
  const fillWater = (i, j) => {
    if (fillLeft(i, j, WATER_FALLING) & fillRight(i, j, WATER_FALLING)) {
      fillLeft(i, j, WATER_STILL)
      fillRight(i, j, WATER_STILL)
      grid[i][j] = WATER_STILL
      fillWater(i-1, j)
    }
  }

  const dropWater = (i, j) => {
    if (i >= maxY+1) return

    grid[i][j] = WATER_FALLING
    if (grid[i+1][j] == SAND) {
      dropWater(i+1, j)
    } else if (grid[i+1][j] == CLAY){
      fillWater(i, j)
    } else if (grid[i+1][j] == WATER_FALLING || grid[i+1][j] == WATER_STILL) {
      fillWater(i+1, j)
    }
  }
  dropWater(0, 500-minX)

  return [grid, minY, maxY]
}

const part1 = (rawInput) => {
  const [grid, minY, maxY] = computeGrid(rawInput)

  var count = 0
  for (var i = minY; i <= maxY; i++) {
    for (var j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == WATER_STILL || grid[i][j] == WATER_FALLING) {
        count++
      }
    }
  }

  return count
}

const part2 = (rawInput) => {
  const [grid, minY, maxY] = computeGrid(rawInput)

  var count = 0
  for (var i = minY; i <= maxY; i++) {
    for (var j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == WATER_STILL && grid[i][j+1] == WATER_FALLING) {
        grid[i][j+1] = WATER_STILL
      }
      if (grid[i][j] == WATER_STILL) {
        count++
      }
    }
  }
  return count
}

run({
  part1: {
    solution: part1,
  },
  part2: {
    solution: part2,
  },
})
