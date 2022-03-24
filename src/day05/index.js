import run from "aocrunner"

const part1 = (input) => {
  var str = input.replace(/([A-Z])/g, (a) => '#'+a.toLowerCase())

  const replace = str => str.replace(/#(.)\1|(?<!#)(.)#\2/g, '')
  var rep = replace(str)
  while (str != rep) {
    str = rep
    rep = replace(str)
  }
  return str.replace(/#/g, '').length
}

const part2 = (input) => {

  return
}

const part1Input = `dabAcCaCBAcCcaDA`
const part2Input = part1Input
run({
  part1: {
    tests: [
      { input: `dabAcCaCBAcCcaDA`, expected: 10 },
      { input: `aabAAB`, expected: 6 },
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
