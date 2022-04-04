import run from "aocrunner"

const re = /pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)/
const parseLine = l => l.match(re).slice(1).map(x => +x)
const parseInput = rawInput => rawInput.split('\n').map(parseLine)

const abs = Math.abs
const part1 = (rawInput) => {
  const nanobots = parseInput(rawInput)

  const max = Math.max(...nanobots.map(x => x[3]))
  const [x0, y0, z0] = nanobots.find(x => x[3] == max)

  const inRange = ([x, y, z]) => abs(x-x0) + abs(y-y0) + abs(z-z0) <= max

  return nanobots.filter(inRange).length
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)

  return
}

const part1Input = `pos=<0,0,0>, r=4
pos=<1,0,0>, r=1
pos=<4,0,0>, r=3
pos=<0,2,0>, r=1
pos=<0,5,0>, r=3
pos=<0,0,3>, r=1
pos=<1,1,1>, r=1
pos=<1,1,2>, r=1
pos=<1,3,1>, r=1`
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
