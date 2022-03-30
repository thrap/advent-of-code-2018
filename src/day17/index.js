import run from "aocrunner"

const re = /^(x|y)=(\d+), (x|y)=(\d+)\.\.(\d+)/
const parseLine = l => l.match(re).slice(1).map(x => +x ? +x : x)
const parseInput = rawInput => rawInput.split('\n').map(parseLine)

const SAND = '.'
const SPRING = '+'
const CLAY = '#'
const WATER_FALLING = '|'
const WATER_STILL = '~'

const printGrid = (grid) => {
  var minI = 100
  var maxI = 0
  var minJ = Number.MAX_VALUE
  var maxJ = 0
  var count = 0
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == WATER_STILL || grid[i][j] == WATER_FALLING) {
        minI = Math.min(minI, i)
        maxI = Math.max(maxI, i)
        minJ = Math.min(minJ, j)
        maxJ = Math.max(maxJ, j)
        count++
      }
    }
  }

  console.log(minI, maxI, minJ, maxJ);
  for (var i = Math.max(minI, 0); i <= Math.min(maxI+10, grid.length-1); i++) {
    var str = ""
    for (var j = Math.max(minJ-10, 0); j <= Math.min(maxJ+10, grid[i].length-1); j++) {
      str+=grid[i][j]
    }
    console.log(str)
  }
}
const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  const ranges = input.map(([axis, v, _, a, b]) => {
    if (axis == 'y') {
      return [[a,b],[v,v]]
    } else {
      return [[v,v],[a,b]]
    }
  })

  var minX = Math.min(...ranges.map(r => r[0][0]))-10
  var maxX = Math.max(...ranges.map(r => r[0][1]))+10
  var minY = Math.min(...ranges.map(r => r[1][0]))
  var maxY = Math.max(...ranges.map(r => r[1][1]))

  const grid = [...Array(maxY+2)].map(_ => Array(maxX-minX+100).fill(SAND))
  grid[0][500-minX] = SPRING
  ranges.forEach(([[x1,x2], [y1, y2]]) => {
    for (var i = y1; i <= y2; i++) {
      for (var j = x1; j <= x2; j++) {
        grid[i][j-minX] = CLAY
      }
    }
  })

  console.log(minX, maxX, minY, maxY);


  const FILLED = 1


  const fillDx = (i, j, dx) => {
    for (var x = j; grid[i+1][x] == CLAY || grid[i+1][x] == WATER_STILL; x+=dx) {
      if (grid[i][x] == CLAY) {
        return FILLED
      }
      grid[i][x] = WATER_STILL
    }
    //grid[i][x] = '%'
    if (grid[i][x] == SAND)
      dropWater(i, x)
    return //FALLING? grid[i][x] == CLAY
  }
  const fillLeft = (i, j) => fillDx(i, j, -1)
  const fillRight = (i, j) => fillDx(i, j, 1)

  var calls = 0
  const fillWater = (i, j) => {
    calls++
    const left = fillLeft(i, j)
    const right = fillRight(i, j)
    if (left == FILLED && right == FILLED) {
      fillWater(i-1, j)
    }
  }

  const dropped = {}
  const dropWater = (i, j) => {

    calls++
    if (calls >= 9000) {
      printGrid(grid)
      console.log(calls);
      throw 1
    }
    if (i >= maxY+1) return
    //console.log(grid.map(l => l.join('')).join('\n'));
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
  const input = parseInput(rawInput)

  return
}

const part1Input = `x=495, y=2..7
y=7, x=495..501
x=501, y=3..7
x=498, y=2..4
x=506, y=1..2
x=498, y=10..13
x=504, y=10..13
y=13, x=498..504`
const part2Input = part1Input
run({
  part1: {
    tests: [
      { input: part1Input, expected: 57 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: part2Input, expected: '' },
    ],
    solution: part2,
  },
  onlyTests: false,
})
