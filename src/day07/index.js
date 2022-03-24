import run from "aocrunner"

const parseLine = l => l.match(/ (.) .* (.) /).slice(1)
const parse = input => input.split('\n').map(parseLine).reduce((acc, [a, b]) => ({
  ...acc,
  [a]: (acc[a] || []),
  [b]: (acc[b] || []).concat([a])
}), {})

const part1 = (input) => {
  const graph = parse(input)
  const nodes = Object.keys(graph).sort()

  const done = {}
  const isReady = (n) => !done[n] && graph[n].every(x => done[x])

  var str = ''
  for (var i = 0; i < nodes.length; i++) {
    const node = nodes.find(isReady)
    str += node
    done[node] = true
  }

  return str
}

const part2 = (input) => {
  const nodes = parse(input)

  return
}

const part1Input = `Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`
const part2Input = part1Input
run({
  part1: {
    tests: [
      { input: part1Input, expected: 'CABDFE' },
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
