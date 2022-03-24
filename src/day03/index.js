import run from "aocrunner"

const re = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/
const parseLine = l => l.match(re).slice(1).map(x => +x)
const parseInput = rawInput => rawInput.split('\n').map(parseLine)

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  const count = {}
  input.forEach(([, dx, dy, width, height]) => {
    for (var x = dx; x < dx+width; x++) {
      for (var y = dy; y < dy+height; y++) {
        count[[x,y]] = (count[[x,y]] || 0) + 1
      }
    }
  })

  return Object.values(count).filter(x => x > 1).length
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
  const count = {}
  input.forEach(([, dx, dy, width, height]) => {
    for (var x = dx; x < dx+width; x++) {
      for (var y = dy; y < dy+height; y++) {
        count[[x,y]] = (count[[x,y]] || 0) + 1
      }
    }
  })

  return input.find(([, dx, dy, width, height]) => {
    for (var x = dx; x < dx+width; x++) {
      for (var y = dy; y < dy+height; y++) {
        if (count[[x,y]] > 1)
          return false
      }
    }
    return true
  })[0]
}

const part1Input = `#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2`
const part2Input = part1Input
run({
  part1: {
    tests: [
      { input: part1Input, expected: 4 },
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
