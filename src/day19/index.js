import run from "aocrunner"

const re = /(.*)/
const parseLine = l => l.match(re).slice(1).map(x => +x ? +x : x)
const parseInput = rawInput => rawInput.split('\n')//.map(parseLine)

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
  const [ip, ...program] = parseInput(rawInput)
  const i = +ip.split(' ')[1]
  const reg = Array(6).fill(0)

  for (var j = 0; j < 10000000; j++) {
    if (j < 10 || j % 100000 == 0) {
      console.log(j, reg);
    }
    if (!program[reg[i]]) break
    const [ins, a, b, c] = program[reg[i]].split(' ')
    inst[ins](+a, +b, +c, reg)
    reg[i]++
  }

  console.log(reg);
  console.log(program)

  return reg[0]
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)

  return
}

const part1Input = `#ip 0
seti 5 0 1
seti 6 0 2
addi 0 1 0
addr 1 2 3
setr 1 0 0
seti 8 0 4
seti 9 0 5`
const part2Input = part1Input
run({
  part1: {
    tests: [
      { input: part1Input, expected: 7 },
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
