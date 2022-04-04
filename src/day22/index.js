import run from "aocrunner"

const parseInput = input => input.match(/.*: (\d+)\n.*: (\d+),(\d+)/).slice(1).map(x => +x)

const part1 = (rawInput) => {
  console.log(rawInput);
  const [depth, goalJ, goalI] = parseInput(rawInput)
  console.log(depth, goalI, goalJ)
  const geo = [...Array(goalI+1)].map(_ => Array(goalJ+1).fill(0))
  const ero = [...Array(goalI+1)].map(_ => Array(goalJ+1).fill(0))
  const cave = [...Array(goalI+1)].map(_ => Array(goalJ+1).fill(0))
  var sum = 0
  for (var i = 0; i <= goalI; i++) {
    for (var j = 0; j <= goalJ; j++) {
      if (i == 0) {
        geo[i][j] = (j * 16807) % 20183
      } else if (j == 0) {
        geo[i][j] = (i * 48271) % 20183
      } else {
        geo[i][j] = (ero[i-1][j] * ero[i][j-1]) % 20183
      }
      geo[goalI][goalJ] = 0
      ero[i][j] = (geo[i][j] + depth) % 20183
      cave[i][j] = ero[i][j]%3
      sum += cave[i][j]
    }
  }

  return sum
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)

  return
}

const part1Input = `depth: 510
target: 10,10`
const part2Input = part1Input
run({
  part1: {
    tests: [
      { input: part1Input, expected: 114 },
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
