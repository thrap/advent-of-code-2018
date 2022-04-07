import run from "aocrunner"

var id = 1
const parseUnit = l => {
  const [u, hp, attr, a, type, i] = l.match(/(\d+) units each with (\d+) hit points(?: \((.*)\))? with an attack that does (\d+) (.*) damage at initiative (\d+)/).slice(1)
  const unit = { id: id++, units: +u, hp: +hp, attack: +a, type, initiative: +i, weak: [], immune: [] }
  if (attr) {
    attr.split('; ').forEach(a => {
      const [, h, list] = a.match(/(.*) to (.*)/)
      unit[h] = list.split(', ')
    })
  }
  return unit
}
const parseUnits = l => l.split('\n').map(parseUnit)
const parseInput = rawInput => {
  const [immune, infection] = rawInput.replace(/.*:\n/g, '').split(/\n\n/).map(parseUnits)

  return [immune, infection]
}

const fight = ([immune, infection]) => {
  const sortVal = group => group.attack * group.units * 100 + group.initiative
  const sort = (a, b) => sortVal(b) - sortVal(a)

  const seen = {}
  for (var i = 0; true; i++) {
    const targeted = new Set()
    const target = (group, defenders) => {
      const valid = defenders.filter(x => !x.immune.includes(group.type) && !targeted.has(x.id) && x.units > 0)
      const weak = valid.filter(x => x.weak.includes(group.type))
      if (weak.length == 0) {
        group.target = valid.sort(sort)[0]
      } else {
        group.target = weak.sort(sort)[0]
      }
      if (group.target)
        targeted.add(group.target.id)
    }

    immune.sort(sort)
    infection.sort(sort)
    immune.forEach(imm => target(imm, infection))
    infection.forEach(inf => target(inf, immune))

    const all = immune.concat(infection).filter(g => g.units > 0).sort((a, b) => b.initiative - a.initiative)

    if (i % 1000 == 0) {
      const str = all.map(g => g.units)
      if (seen[str])
        break
      seen[str] = true
    }

    var acted = false
    all.forEach(group => {
      if (group.units <= 0 || !group.target) return
      const target = group.target
      const effect = group.attack * group.units * (target.weak.includes(group.type) ? 2 : 1)
      target.units -= Math.floor(effect / target.hp)
      acted = true
    })
    if (!acted)
      break
  }
  return [immune.filter(g => g.units > 0), infection.filter(g => g.units > 0)]
}

const part1 = (rawInput) => {
  const [, infection] = fight(parseInput(rawInput))

  return infection.reduce((acc, g) => acc + g.units, 0)
}

const part2 = (rawInput) => {
  for (var i = 1; i <= 1000; i++) {
    const input = parseInput(rawInput)
    input[0].forEach(group =>
      group.attack += i
    )
    const [immune, infection] = fight(input)
    if (immune.length > 0 && infection.length == 0)
      return immune.reduce((acc, g) => acc + g.units, 0)
  }
}

run({
  part1: {
    solution: part1,
  },
  part2: {
    solution: part2,
  },
})
