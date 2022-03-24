import run from "aocrunner"

const parse = input => input.split('\n').map(x => +x)

const part1 = (input) => parse(input).reduce((acc, x) => acc + x)

const part2 = (input) => {
  const change = parse(input)
  var freq = 0
  const seen = {}
  for (var i = 0; true; i++) {
    freq += change[i % change.length]
    if (seen[freq])
      return freq
    seen[freq] = true
  }
}

run({
  part1: {
    solution: part1,
  },
  part2: {
    solution: part2,
  },
})
