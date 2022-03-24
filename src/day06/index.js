import run from "aocrunner"

const parseInput = rawInput => rawInput.split('\n').map(x => x.split(/, +/).map(x => +x))

const dirs = [[0,1],[1,0],[-1,0],[0,-1]]

const manhattan = (x0, y0, x, y) => {
  return Math.abs(x0-x)+Math.abs(y0-y)
}

const part1 = (input) => {
  var nodes = parseInput(input)

  const nearest = (x, y) => {
    var node = -1
    var min = Number.MAX_VALUE
    nodes.forEach((n, i) => {
      const man = manhattan(n[0], n[1], x, y)
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
      var x = dx*10000 + x0
      var y = dy*10000 + y0
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
      if (visited[x*10000+y]) {
        return []
      }
      visited[x*10000+y] = true
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
  const nodes = parseInput(rawInput)

  const distance = (x0, y0) => {
    var sum = 0
    nodes.forEach(([x, y]) => {
      sum += manhattan(x0, y0, x, y)
    })
    return sum
  }

  var size = 10000
  var queue = []
  nodes.forEach(([x, y]) => {
    if (distance(x, y) <= size) {
      queue.push([x, y])
    }
  })

  const visited = {}
  var count = 0
  const expand = ([x, y]) => {
    if (visited[x*10000+y]) {
      return []
    }
    visited[x*10000+y] = true
    if (distance(x, y) > size)
      return []
    count++
    return dirs.map(([dx, dy]) => [x + dx, y + dy])
  }

  while (queue.length) {
    var arr = expand(queue.pop())
    queue.push(...arr)
  }
  return count
}

run({
  part1: {
    solution: part1,
  },
  part2: {
    solution: part2,
  },
})
