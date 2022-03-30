import run from "aocrunner"

const dirs = [[0,1],[1,0],[-1,0],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]

const step = (state) => {
  const step = (i, j) => {
    const count = { '#': 0, '|': 0, '.': 0 }
    dirs.forEach(([dx, dy]) => count[state[i+dx]?.[j+dy]]++)
    const c = state[i][j]
    if (c == '.' && count['|'] >= 3)
      return '|'
    if (c == '|' && count['#'] >= 3)
      return '#'
    if (c == '#' && (count['#'] == 0 || count['|'] == 0))
      return '.'
    return c
  }
  const newState = state.map((l, i) => l.map((_, j) => step(i, j)))
  return newState
}

const part1 = (input) => {
  var state = input.split('\n').map(l => l.split(''))

  for (var i = 0; i < 10; i++) {
    state = step(state)
  }

  const count = { '#': 0, '|': 0, '.': 0 }
  state.flat().forEach(c => count[c]++)

  return count['#'] * count['|']
}

const part2 = (input) => {
  var state = input.split('\n').map(l => l.split(''))

  var seen = {}
  for (var i = 0; i < 1000; i++) {
    var str = state.map(x => x.join('')).join('\n')
    if (seen[str]) break
    seen[str] = i
    state = step(state)
  }

  const limit = 1000000000-i
  const cycle = i-seen[str]

  for (var i = 0; i < limit-cycle*Math.floor(limit/cycle); i++) {
    state = step(state)
  }
  const count = { '#': 0, '|': 0, '.': 0 }
  state.flat().forEach(c => count[c]++)

  return count['#'] * count['|']
}

run({
  part1: {
    solution: part1,
  },
  part2: {
    solution: part2,
  },
})
