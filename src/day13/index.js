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
  carts.forEach(([i, j]) => cartPos[[i,j]] = true)
  const step = ([i, j, state, dirI]) => {
    const [di, dj] = dirs[dirI]
    const c = grid[i+di][j+dj]
    if (cartPos[[i+di,j+dj]]) {
      throw (j+dj) + "," + (i+di)
    }
    cartPos[[i+di,j+dj]] = true
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
      console.log("hei");
    }
    // const toDir = { '>': 0, 'v': 1, '<': 2, '^': 3 }
    console.log("PROBLEMCHAR:", c);
    console.log("DIR:", dirI);
    console.log("STATE:", state);

    console.log(grid[i].slice(Math.max(j-10,0), j+10).join(''));
    console.log(rawInput.split('\n')[i].slice(Math.max(j-10,0), j+10));
    console.log(grid[i][j]);
    console.log(c);
    console.log("åfaen", i, j, state, dirI);

    throw 1
  }

  /* SORTERE GUTTA HER */
  return carts.sort((a, b) => a[0]*1000+a[1] - (b[0]*1000+b[1])).map(step)
}

const part1 = (rawInput) => {
  if (rawInput.length < 100) {
    console.log(rawInput);
  }

  var [grid, carts] = parseInput(rawInput)

  if (rawInput.length < 100) {
    console.log(grid.map(l => l.join('')).join('\n'));
  }

  const print = () => {
    if (rawInput.length < 100) {
      console.log(grid.map((l, i) => l.map((c, j) => carts.some(([x,y]) => x == i && y == j) ? '■' : c).join('')).join('\n'));
    }
  }

  console.log("------------STARTER---------");
  print()

  for (var i = 0; i < 1000; i++) {
    try {
      carts = step(grid, carts)
      print()
    } catch (str) {
      print()
      console.log("Hva i faen?");
      console.log(str);
      if (/\d+,\d+/.test(str))
        return str
      else
        throw str
    }
  }
}

const part2 = (rawInput) => {

}

const part1Input = '/->-\\        \n'+
`|   |  /----\\
| /-+--+-\\  |
| | |  | v  |
\\-+-/  \\-+--/
  \\------/   `
run({
  part1: {
    tests: [
      { input: '|\nv\n|\n|\n|\n^\n|', expected: '0,3' },
      { input: part1Input, expected: '7,3' },
    ],
    solution: part1,
  },
  part2: {
    solution: part2,
  },
  trimTestInputs: false,
})
