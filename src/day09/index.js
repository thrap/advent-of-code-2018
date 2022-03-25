import run from "aocrunner"

const highscore = (input, factor) => {
  var [players, points] = input.match(/(\d+) .* (\d+) /).slice(1).map(x => +x)
  points*=factor

  var current = { val: 0 , left: 0, right: 0 }
  current.left = current
  current.right = current

  const left = (node, n) => n ? left(node.left, n-1) : node
  const right = (node, n) => n ? right(node.right, n-1) : node
  const addBetween = (node, a, b) => {
    node.left = a
    a.right = node
    node.right = b
    b.left = node
    return node
  }
  const remove = node => {
    node.left.right = node.right
    node.right.left = node.left
  }

  var scores = Array(players).fill(0)
  for (var i = 1; i <= points; i++) {
    if (i % 23 == 0) {
      const node = left(current, 7)
      remove(node)
      scores[i % players] += node.val + i
      current = node.right
    } else {
      current = addBetween({val : i}, current.right, right(current, 2))
    }
  }
  return Math.max(...scores)
}

run({
  part1: {
    solution: (input) => highscore(input, 1),
  },
  part2: {
    solution: (input) => highscore(input, 100),
  },
})
