import run from "aocrunner"

const parseInput = rawInput => {
  const [ip, ...program] = rawInput.split('\n')
  const i = +ip.split(' ')[1]
  return [i, program.map(l => l.split(' ').map(x => +x? +x : x))]
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

const execute = (input, reg0) => {
  const [i, program] = parseInput(input)
  const reg = Array(6).fill(0)
  reg[0] = reg0

  for (var j = 0; j < 1000; j++) {
    const [ins, a, b, c] = program[reg[i]]
    inst[ins](a, b, c, reg)
    reg[i]++
  }

  var sum = 0
  for (var q = 1; sum < reg[1]; q++) {
    if (reg[1] % q == 0) {
      sum+=q
    }
  }

  return sum
}

run({
  part1: {
    solution: (input) => execute(input, 0),
  },
  part2: {
    solution: (input) => execute(input, 1),
  },
})
