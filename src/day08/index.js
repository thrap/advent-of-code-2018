import run from "aocrunner"

const parseInput = rawInput => rawInput.split(' ').map(x => +x)

const part1 = (rawInput) => {
  const input = parseInput(rawInput)

  var i = 0
  var sum = 0
  const rec = () => {
    const children = input[i++]
    const metadata = input[i++]
    for (var child = 0; child < children; child++) {
      rec()
    }
    for (var meta = 0; meta < metadata; meta++) {
      sum += input[i++]
    }
  }
  rec()
  return sum
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)


}

const part1Input = `2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2`
const part2Input = part1Input
run({
  part1: {
    tests: [
      { input: part1Input, expected: 138 },
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
