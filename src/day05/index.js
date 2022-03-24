import run from "aocrunner"

const react = input => {
  var str = input.replace(/([A-Z])/g, (a) => '#'+a.toLowerCase())

  const replace = str => str.replace(/#(.)\1|(?<!#)(.)#\2/g, '')
  var rep = replace(str)
  while (str != rep) {
    str = rep
    rep = replace(str)
  }
  return str.replace(/#/g, '').length
}

const part1 = (input) => react(input)

const part2 = (input) => {
  const regex = c => new RegExp(c+'|'+c.toUpperCase(), 'g')

  const chars = new Set(input.split('').map(x => x.toLowerCase()))

  const lengths = [...chars].map(c => react(input.replace(regex(c), '')))
  return Math.min(...lengths)
}

run({
  part1: {
    solution: part1,
  },
  part2: {
    solution: part2,
  },
})
