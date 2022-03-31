import run from "aocrunner"

const parseInput = rawInput => {
  const groups = []
  var input = rawInput.slice(1, rawInput.length-1)
  while (input.includes('(')) {
    input = input.replace(/\(([^()]*)\)/g, (_, b) => '_' + (groups.push(b.split('|')) - 1))
  }
  return [input, groups]
}

const dirs = { S: [1,0], E: [0,1], N: [-1,0], W: [0,-1] }

const parseGrid = (rawInput) => {
  const input = parseInput(rawInput)
  const [str, groups] = input
  const doors = {}
  const rooms = { [[0,0]]: true }
  const queue = []
  const seen = {}
  const rec = (str, i, j) => {
    if(str.length == 0 || seen[str+" "+i +" "+j]) return
    seen[str+" "+i +" "+j] = true

    if (/^_(\d+)/.test(str)) {
      const [, idx, rest] = str.match(/^_(\d+)(.*)/)
      queue.push(...groups[idx].map(head => [head+rest, i, j]))
    } else {
      const [di, dj] = dirs[str[0]]
      doors[[i+di, j+dj]] = true
      rooms[[i+2*di, j+2*dj]] = true
      rec(str.slice(1), i+2*di, j+2*dj)
    }
  }
  rec(str, 0, 0)
  while (queue.length) {
    rec(...queue.pop())
  }

  const roomPos = Object.keys(rooms).map(x => x.split(',').map(x => +x))
  const minI = Math.min(...roomPos.map(x => x[0]))-1
  const maxI = Math.max(...roomPos.map(x => x[0]))+1
  const minJ = Math.min(...roomPos.map(x => x[1]))-1
  const maxJ = Math.max(...roomPos.map(x => x[1]))+1

  const grid = [...Array(maxI-minI+1)].map(_ => Array(maxJ-minJ+1))
  for (var i = minI; i <= maxI; i++) {
    for (var j = minJ; j <= maxJ; j++) {
      grid[i-minI][j-minJ] = doors[[i, j]] || rooms[[i, j]] ? (i % 2 == 0 && j % 2 == 0 ? '.' : '+') : '#'
    }
  }
  return [grid, [-minI, -minJ]]
}

const solve = (rawInput, f) => {
  const [grid, startPos] = parseGrid(rawInput)

  const dirs = [[1,0],[0,1],[-1,0],[0,-1]]
  const queue = [[...startPos, 0]]
  const seen = {}

  var acc = 0
  while (queue.length) {
    const [i, j, moves] = queue.shift()
    if (seen[[i, j]]) continue
    acc = f(acc, moves)
    seen[[i, j]] = true
    dirs.forEach(([di, dj]) => {
      if (grid[i + di][j + dj] == '+') {
        queue.push([i+2*di, j+2*dj, moves+1])
      }
    })
  }
  return acc
}

run({
  part1: {
    solution: (input) => solve(input, Math.max),
  },
  part2: {
    solution: (input) => solve(input, (acc, moves) => acc += moves >= 1000 ? 1 : 0),
  },
})
