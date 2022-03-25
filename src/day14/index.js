import run from "aocrunner"

const parseInput = rawInput => +rawInput

const part1 = (rawInput) => {
  const input = parseInput(rawInput)

  const recipes = [3, 7]

  const combine = (x, y) => {
    var sum = x + y
    if (sum >= 10) {
      recipes.push(Math.floor(sum/10))
    }
    recipes.push(sum % 10)
  }


  var a = 0
  var b = 1
  for (var i = 0; recipes.length < input + 10; i++) {
    const aVal = recipes[a]
    const bVal = recipes[b]
    combine(aVal, bVal)
    a = (a + aVal+1) % recipes.length
    b = (b + bVal+1) % recipes.length
  }

  return recipes.slice(input, input+10).join('')
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
      { input: '9', expected: '5158916779' },
    ],
    solution: part1,
  },
  part2: {
    tests: [
    ],
    solution: part2,
  },
  onlyTests: false,
})
