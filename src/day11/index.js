import run from "aocrunner"

const grid = serial => {
  const grid = [...Array(301)].map((_,i) => [...Array(301)].map((_, j) => powerLevel(i, j, serial)))
  return grid
}

const powerLevel = (x, y, serial) => {
  const rackId = x + 10
  var powerLevel = (rackId * y + serial) * rackId

  const str = '00'+powerLevel
  powerLevel = +str[str.length-3]
  return powerLevel - 5
}

const square = (x, y, size, grid) => {
  var sum = 0
  for (var dx = 0; dx < size; dx++) {
    for (var dy = 0; dy < size; dy++) {
      if (x+dx > 300 && y+dy > 300) throw 1

      sum += grid[x+dx][y+dy]
    }
  }
  return sum
}

const maxSquare = (grid, size) => {
  var max = square(1, 1, size, grid)
  var ans = '1,1'
  for (var x = 1; x <= 300-size+1; x++) {
    for (var y = 1; y <= 300-size+1; y++) {
      var sum = square(x, y, size, grid)

      if (sum > max) {
        max = sum
        ans = x+','+y
      }
    }
  }
  return [ans, max]
}

const part1 = (input) => {
  return maxSquare(grid(+input), 3)[0]
}

const part2 = (input) => {
  const arr = grid(+input)
  var max = 0
  var ans
  for (var size = 1; size <= 300; size++) {
    const localMax = maxSquare(arr, size)
    if (max < localMax[1]) {
      max = localMax[1]
      ans = localMax[0]+','+size
    }
    if (localMax[1] < 0)
      return ans
  }
}

run({
  part1: {
    tests: [
      { input: '18', expected: '33,45' },
      { input: '42', expected: '21,61' },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: '18', expected: '90,269,16' },
      { input: '42', expected: '232,251,12' },
    ],
    solution: part2,
  },
  onlyTests: false,
})
