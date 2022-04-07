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

  for (var i = 0; i < 1000; i++) {
    const targeted = new Set()
    const target = (group, defenders) => {
      delete group['target']
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

    const all = immune.concat(infection).sort((a, b) => b.initiative - a.initiative)

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
  return [immune, infection]
}

const part1 = (rawInput) => {
  const [, infection] = fight(parseInput(rawInput))

  return infection.filter(g => g.units > 0).reduce((acc, g) => acc + g.units, 0)
}

const part2 = (rawInput) => {

}

const part1Input = `Immune System:
17 units each with 5390 hit points (weak to radiation, bludgeoning) with an attack that does 4507 fire damage at initiative 2
989 units each with 1274 hit points (immune to fire; weak to bludgeoning, slashing) with an attack that does 25 slashing damage at initiative 3

Infection:
801 units each with 4706 hit points (weak to radiation) with an attack that does 116 bludgeoning damage at initiative 1
4485 units each with 2961 hit points (immune to radiation; weak to fire, cold) with an attack that does 12 slashing damage at initiative 4`
const part2Input = part1Input
run({
  part1: {
    tests: [
      { input: part1Input, expected: 5216 },
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
