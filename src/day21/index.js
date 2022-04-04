import run from "aocrunner"

const parseInput = rawInput => {
  const [ip, ...program] = rawInput.split('\n')
  const i = +ip.split(' ')[1]
  return [i, program.map(l => l.split(' ').map(x => isNaN(parseInt(x))? x : +x))]
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

const execute2 = (input) => {
  const [i, program] = parseInput(input)
  const reg = Array(6).fill(0)

  const seen = {}
  for (var j = 0; true; j++) {
    const setReg3 = () => {
      while(reg[3] >= 256) {
        j = j+7*Math.floor(reg[3]/256)+6+10
        reg[5] = reg[3] % 256 + reg[5]
        reg[5] = reg[5] % 16777216
        reg[5] = reg[5] * 65899
        reg[5] = reg[5] % 16777216
        reg[3] = Math.floor(reg[3]/256)
      }
    }
    if (reg[2] == 5) {
      reg[3] = 65536
      reg[5] = 9010242
      reg[2] = 8
      j+=2
      setReg3()
    } else if (reg[2] == 8) {
      j+=9
      reg[5] = reg[3] % 256 + reg[5]
      reg[5] = reg[5] % 16777216
      reg[5] = reg[5] * 65899
      reg[5] = reg[5] % 16777216
      if (seen[reg[5]]) {
        return seen
      }
      seen[reg[5]] = j
      reg[3] = reg[5] | 65536
      reg[5] = 9010242
      j+=3
      setReg3()
      reg[2] = 8
    } else {
      const [ins, a, b, c] = program[reg[i]]
      inst[ins](a, b, c, reg)
      reg[i]++
    }
  }
}

const solve = (rawInput, f) => {
  const obj = execute2(rawInput)
  const extreme = f(...Object.values(obj))
  return +Object.keys(obj).filter(x => obj[x] == extreme)[0]
}

run({
  part1: {
    solution: (input) => solve(input, Math.min),
  },
  part2: {
    solution: (input) => solve(input, Math.max),
  },
})
