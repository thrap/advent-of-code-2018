import run from "aocrunner"

const re = /(.*)/
const parseLine = l => l.match(re).slice(1).map(x => +x ? +x : x)
const parseInput = rawInput => {
  const [a, b] = rawInput.split('\n\n')
  const ruleArr = b.split('\n').map(l => l.split(' => '))
  const rules = ruleArr.reduce((acc, [p, x]) => ({
    ...acc,
    [p] : x
  }), {})
  return [a.split(': ')[1], rules]
}

const part1 = (rawInput) => {
  const [initial, rules] = parseInput(rawInput)

  const step = str => {
    var res = ''
    for (var i = 2; i-2 < str.length-3; i++) {
      res += rules[str.slice(i-2, i-2+5)] || '.'
    }
    return res
  }

  var state = initial

  for (var i = 0; i < 20; i++) {
    state = step("...."+state+"....")
  }
  return state.split('').map((c,j) => c == '#' ? j-2*i : 0).reduce((acc, x) => acc+x)
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)

  return
}

const part1Input = `initial state: #..#.#..##......###...###

...## => #
..#.. => #
.#... => #
.#.#. => #
.#.## => #
.##.. => #
.#### => #
#.#.# => #
#.### => #
##.#. => #
##.## => #
###.. => #
###.# => #
####. => #`
const part2Input = part1Input
run({
  part1: {
    tests: [
      { input: part1Input, expected: 325 },
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
