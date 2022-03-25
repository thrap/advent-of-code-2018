import run from "aocrunner"

const parseInput = input => input.match(/(\d+) .* (\d+) /).slice(1).map(x => +x)

const printState = (count, zero, current) => {
  var asd = zero
  var str = ''
  for (var j = 0; j < count; j++) {
    str += (asd.val < 10 ? ' ' : '') + (asd.val == current.val ? '(' : ' ') + asd.val + (asd.val == current.val ? ')' : ' ')
    asd = asd.right
  }
  console.log(str);
}

const part1 = (input) => {
  const [players, points] = parseInput(input)

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
      continue
    }

    current = addBetween({val : i}, current.right, right(current, 2))
  }
  return Math.max(...scores)
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)

  return
}

run({
  part1: {
    tests: [
      { input: `9 players; last marble is worth 25 points`, expected: 32 },
      { input: `10 players; last marble is worth 1618 points`, expected: 8317 },
      { input: `13 players; last marble is worth 7999 points`, expected: 146373 },
      { input: `17 players; last marble is worth 1104 points`, expected: 2764 },
      { input: `21 players; last marble is worth 6111 points`, expected: 54718 },
      { input: `30 players; last marble is worth 5807 points`, expected: 37305 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      //{ input: '', expected: '' },
    ],
    solution: part2,
  },
  onlyTests: false,
})
