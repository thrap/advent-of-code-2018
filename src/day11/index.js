import run from "aocrunner"

const parseGrid = s => [...Array(301)].map((_,i) => [...Array(301)].map((_, j) => power(i, j, s)))

const power = (x, y, s) => Math.floor((((x + 10) * y + s) * (x + 10))/100)%10 - 5

const maxPower = (input, minSize, maxSize) => {
  const grid = parseGrid(+input)
  var maxSum = 0
  var ans

  const rows = [...Array(301)].map(_ => Array(301).fill(0))
  const cols = [...Array(301)].map(_ => Array(301).fill(0))
  const squareSum = [...Array(301)].map(_ => Array(301).fill(0))
  for (var size = 1; size <= maxSize; size++) {
    for (var j = 1; j <= 300; j++) {
      for (var i = 1; i <= 300; i++) {
        rows[j][i] += grid[j]?.[i+size-1] || 0
        cols[j][i] += grid[j+size-1]?.[i] || 0
      }
    }
    for (var j = 1; j+size-1 <= 300; j++) {
      for (var i = 1; i+size-1 <= 300; i++) {
        squareSum[j][i] += cols[j][i+size-1]+rows[j+size-1][i]-grid[j+size-1][i+size-1]
        if (size >= minSize && maxSum < squareSum[j][i]) {
          maxSum = squareSum[j][i]
          ans = j+','+i+','+size
        }
      }
    }
  }
  return ans
}

run({
  part1: {
    solution: (input) => maxPower(input, 3, 3).replace(/,[^,]+$/,''),
  },
  part2: {
    solution: (input) => maxPower(input, 1, 300),
  },
})
