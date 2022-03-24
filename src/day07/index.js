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
  const process = (n) => done[n] = true && n

  return nodes.map(_ => process(nodes.find(isReady))).join('')
}

const part2 = (input) => {
  const graph = parse(input)
  const nodes = Object.keys(graph).sort()

  const done = {}
  const workers = Array(5).fill(0).map((_, i) => i)
  const processing = workers.map(_ => '')
  var work = workers.map(_ => 1)

  const isReady = (n) => !done[n] && graph[n].every(x => done[x]) && !processing.includes(n)

  const process = (worker) => {
    const node = nodes.find(isReady)
    if (!node || work[worker] > 0) return
    work[worker] = node.charCodeAt(0) - 4
    processing[worker] = node
  }

  const finish = (worker) => {
    if (work[worker] > 0) return
    var node = processing[worker]
    done[node] = true
    processing[worker] = ''
  }

  for(var i = 0; work.some(x => x > 0); i++) {
    work = work.map(x => x - 1)
    workers.forEach(finish)
    workers.forEach(process)
  }
  return i-1
}

run({
  part1: {
    solution: part1,
  },
  part2: {
    solution: part2,
  },
})
