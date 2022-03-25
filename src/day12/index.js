import run from "aocrunner"

const parseInput = rawInput => {
  const [a, b] = rawInput.split('\n\n')
  const ruleArr = b.split('\n').map(l => l.split(' => '))
  const rules = ruleArr.reduce((acc, [p, x]) => ({
    ...acc,
    [p] : x
  }), {})
  return [a.split(': ')[1], rules]
}

const step = (initial, rules) => {
  const state = "...."+initial+"...."
  var res = ''
  for (var i = 2; i-2 < state.length-3; i++) {
    res += rules[state.slice(i-2, i-2+5)] || '.'
  }
  return res
}

const bruteforce = (state, generations, rules) => {
  for (var i = 0; i < generations; i++) {
    state = step(state, rules)
  }
  return state.split('').reduce((acc, c, j) => acc + (c == '#' ? j-2*i : 0), 0)
}

const part1 = (rawInput) => {
  const [initial, rules] = parseInput(rawInput)

  return bruteforce(initial, 20, rules)
}

const part2 = (rawInput) => {
  const [initial, rules] = parseInput(rawInput)

  var limit = 50000000000

  var state = initial
  var prev = ''
  for (var i = 0; state != prev; i++) {
    prev = state
    state = step(state, rules).replace(/^\.+/, '').replace(/\.+$/, '')
  }

  const value = bruteforce(initial, i, rules)
  const diff = bruteforce(initial, i+1, rules) - value
  return value + (limit-i)*diff
}

run({
  part1: {
    solution: part1,
  },
  part2: {
    solution: part2,
  },
})
