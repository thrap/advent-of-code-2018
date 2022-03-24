import run from "aocrunner"

const re = /(.*)/
const parseLine = l => l.match(re).slice(1).map(x => +x ? +x : x)
const parseInput = rawInput => rawInput.split('\n')//.map(parseLine)

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  console.log(input)

  return
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)

  return
}

const part1Input = ``
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
