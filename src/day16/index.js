import run from "aocrunner"

const re = /Before: (.*)\n(\d+) (\d+) (\d+) (\d+)\nAfter:  (.*)/
const parseInput = rawInput => {
  const [samples, program] = rawInput.split(/\n\n\n\n/)
  return [samples.split('\n\n'), program.split('\n')]
}

const addi = (a, b, c, reg) => reg[c] = reg[a] + b
const addr = (a, b, c, reg) => addi(a, reg[b], c, reg)

const muli = (a, b, c, reg) => reg[c] = reg[a] * b
const mulr = (a, b, c, reg) => muli(a, reg[b], c, reg)

const bani = (a, b, c, reg) => reg[c] = reg[a] & b
const banr = (a, b, c, reg) => bani(a, reg[b], c, reg)

const bori = (a, b, c, reg) => reg[c] = reg[a] | b
const borr = (a, b, c, reg) => bori(a, reg[b], c, reg)

const seti = (a, _, c, reg) => reg[c] = a
const setr = (a, _, c, reg) => seti(reg[a], _, c, reg)

const gtii = (a, b, c, reg) => reg[c] = a > b ? 1 : 0
const gtir = (a, b, c, reg) => gtii(a, reg[b], c, reg)
const gtri = (a, b, c, reg) => gtii(reg[a], b, c, reg)
const gtrr = (a, b, c, reg) => gtii(reg[a], reg[b], c, reg)

const eqii = (a, b, c, reg) => reg[c] = a == b ? 1 : 0
const eqir = (a, b, c, reg) => eqii(a, reg[b], c, reg)
const eqri = (a, b, c, reg) => eqii(reg[a], b, c, reg)
const eqrr = (a, b, c, reg) => eqii(reg[a], reg[b], c, reg)

const inst = {
  addi, addr, muli, mulr, bani, banr, bori, borr, seti, setr, gtir, gtri, gtrr, eqir, eqri, eqrr
}

const part1 = (rawInput) => {
  const [samples] = parseInput(rawInput)

  const test = (reg, f, expected) => {
    const copy = [...reg.map(x => x)]
    f(copy)
    return copy.join() == expected.join()
  }

  return samples.map(block => {
    const match = block.match(re)
    const reg = eval(match[1])
    const i = +match[2]
    const a = +match[3]
    const b = +match[4]
    const c = +match[5]
    const expected = eval(match[6])
    return Object.values(inst).filter(f => {
      return test(reg, (reg) => f(a,b,c, reg), expected)
    }).length
  }).filter(x => x >= 3).length
}

const part2 = (rawInput) => {
  const [samples, program] = parseInput(rawInput)

  const test = (reg, f, expected) => {
    const copy = [...reg.map(x => x)]
    f(copy)
    return copy.join() == expected.join()
  }

  const possible = [...Array(16)].map(_ => Object.keys(inst))

  samples.map(block => {
    const match = block.match(re)
    const reg = eval(match[1])
    const i = +match[2]
    const a = +match[3]
    const b = +match[4]
    const c = +match[5]
    const expected = eval(match[6])

    const candidates = Object.keys(inst).filter(key => {
      return test(reg, (reg) => inst[key](a,b,c, reg), expected)
    })

    possible[i] = possible[i].filter(x => candidates.includes(x))
  })

  const map = (certain) => {
    possible.forEach((x, i) => {
      const pos = x.filter(l => !Object.values(certain).includes(l))
      if (pos.length == 1) {
        certain[i] = pos[0]
        map(certain)
      }
    })
    return certain
  }

  const mapping = map({})

  const reg = [0, 0, 0, 0]
  program.forEach(l => {
    const [i, a, b, c] = l.split(' ').map(x => +x)
    inst[mapping[i]](a, b, c, reg)
  })

  return reg[0]
}

run({
  part1: {
    solution: part1,
  },
  part2: {
    solution: part2,
  },
})
