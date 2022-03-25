import run from "aocrunner"

const part1 = (input) => {
  const steps = +input

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
  for (var i = 0; recipes.length < steps + 10; i++) {
    const aVal = recipes[a]
    const bVal = recipes[b]
    combine(aVal, bVal)
    a = (a + aVal+1) % recipes.length
    b = (b + bVal+1) % recipes.length
  }

  return recipes.slice(steps, steps+10).join('')
}

const part2 = (input) => {
  const goal = +input
  const recipes = [3, 7]

  var a = 0
  var b = 1
  var acc = 0

  const limit = Math.pow(10, input.length)
  for (var i = 0; true; i++) {
    const aVal = recipes[a]
    const bVal = recipes[b]

    var sum = aVal + bVal
    if (sum >= 10) {
      recipes.push(Math.floor(sum/10))

      acc = (acc * 10 + Math.floor(sum/10))%limit
      if (acc == goal)
        return recipes.length-input.length
    }
    recipes.push(sum % 10)

    acc = (acc * 10 + sum % 10)%limit
    if (acc == goal)
      return recipes.length-input.length

    a = (a + aVal+1) % recipes.length
    b = (b + bVal+1) % recipes.length
  }
}

run({
  part1: {
    tests: [
      { input: '9', expected: '5158916779' },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: '51589', expected: 9 },
      { input: '01245', expected: 5 },
      { input: '92510', expected: 18 },
      { input: '59414', expected: 2018 },
    ],
    solution: part2,
  },
  onlyTests: false,
})
