import run from "aocrunner"
const _ = { sum : arr => arr.reduce((acc, x) => acc + x, 0) }

const tree = input => {
  const header = input.split(' ').map(x => +x)
  var i = 0
  const node = () => {
    const children = header[i++]
    const nodes = []
    const metadata = header[i++]
    const vals = []
    for (var child = 0; child < children; child++) {
      nodes.push(node())
    }
    for (var meta = 0; meta < metadata; meta++) {
      vals.push(header[i++])
    }
    return { nodes, vals }
  }
  return node()
}

const part1 = ({nodes, vals}) => _.sum(vals) + _.sum(nodes.map(part1))

const part2 = ({nodes, vals}) => nodes.length ? _.sum(vals.map(i => nodes[i-1]).filter(x => x).map(part2)) : _.sum(vals)

run({
  part1: {
    solution: input => part1(tree(input)),
  },
  part2: {
    solution: input => part2(tree(input)),
  },
})
