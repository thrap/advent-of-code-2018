import run from "aocrunner"

const parseInput = rawInput => rawInput.split('\n').map(x => x.split(/, +/).map(x => +x))

const dirs = [[0,1],[1,0],[-1,0],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]
const part1 = (input) => {
  var nodes = parseInput(input)

  const manhattan = ([x0, y0], [x, y]) => {
    return Math.abs(x0-x)+Math.abs(y0-y)
  }

  const nearest = (x, y) => {
    var node = -1
    var min = Number.MAX_VALUE
    nodes.forEach((n, i) => {
      const man = manhattan(n, [x, y])
      if (man == min)
        node = -1
      if (man < min) {
        min = man
        node = i
      }
    })
    return node
  }

  const isInfinite = (i, [x0, y0]) => {
    return dirs.some(([dx, dy]) => {
      var x = dx*100000 + x0
      var y = dy*100000 + y0
      if (nearest(x, y) == i) {
        return true
      }
    })
  }

  const finite = nodes.map((x, i) => [i, x]).filter(([i, n]) => !isInfinite(i, n))

  const area = ([i, [x0, y0]]) => {
    const visited = {}
    var count = 0
    const expand = ([x, y]) => {
      if (visited[[x,y]]) {
        return []
      }
      visited[[x, y]] = true
      if (nearest(x, y) != i)
        return []
      count++
      return dirs.map(([dx, dy]) => [x + dx, y + dy])
    }

    var queue = [[x0, y0]]
    while (queue.length) {
      var arr = expand(queue.pop())
      queue.push(...arr)
    }
    return count
  }

  return Math.max(...finite.map(area))
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)

  return
}

const part1Input = `1, 1
1, 6
8, 3
3, 4
5, 5
8, 9`
const part2Input = part1Input
run({
  part1: {
    tests: [
      { input: part1Input, expected: 17 },
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
