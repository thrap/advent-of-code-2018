import run from "aocrunner"

const re = /(.*)/
const parseLine = l => l.match(re).slice(1).map(x => +x ? +x : x)
const parseInput = rawInput => rawInput.split('\n')//.map(parseLine)

const part1 = (rawInput) => {
  const input = parseInput(rawInput)

  const checksum = {}
  input.forEach(([...x]) => {
    const count = {}
    x.forEach(c => {
      count[c] = (count[c]||0) + 1
    })
    const unique = new Set(Object.values(count))
    unique.forEach(v => {
      checksum[v] = (checksum[v] || 0) + 1
    })
  })

  return checksum[2]*checksum[3]
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)

  return
}

run({
  part1: {
    solution: part1,
  },
  part2: {
    solution: part2,
  },
})
