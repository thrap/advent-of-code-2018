import run from "aocrunner"
import heapify from "heapify"

const parseInput = input => input.match(/.*: (\d+)\n.*: (\d+),(\d+)/).slice(1).map(x => +x)

const dirs = [[0,1],[1,0],[0,-1],[-1,0]]
const TORCH = 1, NOTHING = 2, CLIMBING = 3
const ROCKY = 0, WET = 1, NARROW = 2
const aStar = (grid, start, goal, maxSize=64) => {
  const [goalX, goalY] = goal
  const states = [[...start, 0, TORCH, []]]
  var queue = new heapify.MinQueue(maxSize)
  queue.push(0, 0)

  const valid = (equip, tile) => {
    switch(tile) {
      case ROCKY: return equip == TORCH || equip == CLIMBING
      case WET: return equip == CLIMBING || equip == NOTHING
      case NARROW: return equip == TORCH || equip == NOTHING
    }
  }

  const seen = {}
  const addState = (x, y, moves, equip, path) => {
    var key = Math.max(grid.length, grid[0].length)*(x) + y+ (grid.length * grid[0].length * 100 * equip)
    if(seen[key] <= moves || !valid(equip, grid[x][y])) return
    seen[key] = moves

    var man = Math.abs(goalX - (x)) + Math.abs(goalY - (y))
    states.push([x, y, moves, equip])
    queue.push(states.length-1, moves + man)
  }

  while (queue.length) {
    const [x, y, moves, equip] = states[queue.pop()]

    if (x == goalX && y == goalY && equip == TORCH) {
      return moves
    }

    if (equip != TORCH) {
      addState(x, y, moves + 7, TORCH)
    }
    if (equip != NOTHING) {
      addState(x, y, moves + 7, NOTHING)
    }
    if (equip != CLIMBING) {
      addState(x, y, moves + 7, CLIMBING)
    }


    dirs.forEach(([dx, dy]) => {
      if(grid[x + dx]?.[y+dy] === undefined) return

      addState(x+dx, y+dy, moves + 1, equip)
    })
  }
  return Infinity
}

const part1 = (rawInput) => {
  const [depth, goalJ, goalI] = parseInput(rawInput)
  const geo = [...Array(goalI+1)].map(_ => Array(goalJ+1).fill(0))
  const ero = [...Array(goalI+1)].map(_ => Array(goalJ+1).fill(0))
  const cave = [...Array(goalI+1)].map(_ => Array(goalJ+1).fill(0))
  var sum = 0
  for (var i = 0; i < geo.length; i++) {
    for (var j = 0; j < geo[0].length; j++) {
      if (i == 0) {
        geo[i][j] = (j * 16807) % 20183
      } else if (j == 0) {
        geo[i][j] = (i * 48271) % 20183
      } else {
        geo[i][j] = (ero[i-1][j] * ero[i][j-1]) % 20183
      }
      geo[goalI][goalJ] = 0
      ero[i][j] = (geo[i][j] + depth) % 20183
      cave[i][j] = ero[i][j]%3
      sum += cave[i][j]
    }
  }

  return sum
}

const part2 = (rawInput) => {
  const [depth, goalJ, goalI] = parseInput(rawInput)
  const add = 1000
  const geo = [...Array(goalI+add)].map(_ => Array(goalJ+add).fill(0))
  const ero = [...Array(goalI+add)].map(_ => Array(goalJ+add).fill(0))
  const cave = [...Array(goalI+add)].map(_ => Array(goalJ+add).fill(0))
  for (var i = 0; i < geo.length; i++) {
    for (var j = 0; j < geo[0].length; j++) {
      if (i == 0) {
        geo[i][j] = (j * 16807) % 20183
      } else if (j == 0) {
        geo[i][j] = (i * 48271) % 20183
      } else {
        geo[i][j] = (ero[i-1][j] * ero[i][j-1]) % 20183
      }
      geo[goalI][goalJ] = 0
      ero[i][j] = (geo[i][j] + depth) % 20183
      cave[i][j] = ero[i][j]%3
    }
  }

  return aStar(cave, [0, 0], [goalI, goalJ], 100000)
}

const part1Input = `depth: 510
target: 10,10`
const part2Input = part1Input
run({
  part1: {
    tests: [
      { input: part1Input, expected: 114 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: part2Input, expected: 45 },
    ],
    solution: part2,
  },
  onlyTests: false,
})
