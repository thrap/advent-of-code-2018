import run from "aocrunner"

const parseInput = rawInput => {
  const grid = rawInput.split('\n').map(l => l.split(''))
  var carts = []

  grid.forEach((row, i) => row.forEach((c, j) => {
    if (/[<^v>]/.test(c)) {
      grid[i][j] = /[<>]/.test(c) ? '-' : '|'
      carts.push([i, j, 0, toDir[c]])
    }
  }))

  return [grid, carts]
}

const dirs = [[0,1],[1,0],[0,-1],[-1,0]]
const toDir = { '>': 0, 'v': 1, '<': 2, '^': 3 }

const step = (grid, carts) => {
  const cartPos = {}
  const crashed = {}

  carts.forEach(([i, j], id) => cartPos[[i,j]] = id)
  const step = ([i, j, state, dirI], index) => {
    if (crashed[index]) {
      return [i, j, state, dirI]
    }
    const [di, dj] = dirs[dirI]
    const c = grid[i+di][j+dj]
    if (cartPos[[i+di,j+dj]] !== undefined) {
      crashed[index] = true
      crashed[cartPos[[i+di,j+dj]]] = true
      delete cartPos[[i+di,j+dj]]
      delete cartPos[[i,j]]
      return [i+di, j+dj, state, dirI]
    }
    delete cartPos[[i,j]]
    cartPos[[i+di,j+dj]] = index
    if (dirI % 2 == 0 && c == '-') {
      return [i+di, j+dj, state, dirI]
    }
    if (dirI % 2 == 1 && c == '|') {
      return [i+di, j+dj, state, dirI]
    }

    if (c == '+') {
      switch(state) {
        case 0: return [i+di, j+dj, 1, (4+dirI-1)%4]
        case 1: return [i+di, j+dj, 2, dirI]
        case 2: return [i+di, j+dj, 0, (dirI+1)%4]
      }
    }

    const turns = { '\\': [1,0,3,2], '/': [3,2,1,0]}
    if (/[\\/]/.test(c)) {
      return [i+di, j+dj, state, turns[c][dirI]]
    }

    throw 1
  }

  return [carts.map(step), Object.keys(crashed)]
}

const part1 = (rawInput) => {
  if (rawInput.length < 100) {
    console.log(rawInput);
  }

  var [grid, carts] = parseInput(rawInput)

  const print = () => {
    if (rawInput.length < 100) {
      console.log(grid.map((l, i) => l.map((c, j) => carts.some(([x,y]) => x == i && y == j) ? '■' : c).join('')).join('\n'));
    }
  }
  print()

  for (var i = 0; true; i++) {
    carts = carts.sort((a, b) => a[0]*1000+a[1] - (b[0]*1000+b[1]))
    var [carts, crashed] = step(grid, carts)
    if (crashed.length != 0) {
      const [y, x] = carts[crashed[0]]
      return x+','+y
    }
    print()
  }
}

const part2 = (rawInput) => {
  var [grid, carts] = parseInput(rawInput)

  const print = () => {
    if (rawInput.length < 100) {
      console.log(grid.map((l, i) => l.map((c, j) => carts.some(([x,y]) => x == i && y == j) ? '■' : c).join('')).join('\n'));
    }
  }

  print()
  for (var i = 0; carts.length > 1; i++) {
    carts = carts.sort((a, b) => a[0]*1000+a[1] - (b[0]*1000+b[1]))
    var [carts, crashed] = step(grid, carts)
    if (crashed.length != 0) {
      carts = carts.filter((_, i) => !crashed.includes(''+i))
    }
    print()
  }
  return carts[0][1]+','+carts[0][0]
}

const part1Input = '/->-\\        \n'+
`|   |  /----\\
| /-+--+-\\  |
| | |  | v  |
\\-+-/  \\-+--/
  \\------/   `
const part2Input = '/>-<\\  \n'+
'|   | \n'+
`| /<+-\\
| | | v
\\>+</ |
  |   ^
  \\<->/`
run({
  part1: {
    tests: [
      { input: '|\nv\n|\n|\n|\n^\n|', expected: '0,3' },
      { input: part1Input, expected: '7,3' },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: part2Input, expected: '6,4' },
    ],
    solution: part2,
  },
})
