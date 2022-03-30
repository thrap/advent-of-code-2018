import run from "aocrunner"

const dirs = [[0,1],[1,0],[-1,0],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]
const parseInput = rawInput => rawInput.split('\n').map(l => l.split(''))

const part1 = (rawInput) => {
  var state = parseInput(rawInput)

  const step = (state) => {
    const step = (i, j) => {
      const count = { '#': 0, '|': 0, '.': 0 }
      dirs.forEach(([dx, dy]) => count[state[i+dx]?.[j+dy]]++)
      if (state[i][j] == '.' && count['|'] >= 3) {
        return '|'
      }
      if (state[i][j] == '|' && count['#'] >= 3) {
        return '#'
      }
      if (state[i][j] == '#' && (count['#'] == 0 || count['|'] == 0)) {
        return '.'
      }
      return state[i][j]
    }
    const newState = state.map((l, i) => l.map((_, j) => step(i, j)))
    return newState
  }

  const print = s => console.log(s.map(x => x.join('')).join('\n'));

  for (var i = 0; i < 10; i++) {
    state = step(state)
    //print(state);
  }

  const count = { '#': 0, '|': 0, '.': 0 }
  state.flat().forEach(c => count[c]++)

  return count['#'] * count['|']
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)

  return
}

const part1Input = `.#.#...|#.
.....#|##|
.|..|...#.
..|#.....#
#.#|||#|#|
...#.||...
.|....|...
||...#|.#|
|.||||..|.
...#.|..|.`
const part2Input = part1Input
run({
  part1: {
    tests: [
      { input: part1Input, expected: '' },
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
