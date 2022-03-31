import run from "aocrunner"

const re = /(.*)/
const parseLine = l => l.match(re).slice(1).map(x => +x ? +x : x)
const parseInput = rawInput => {
  const [ip, ...program] = rawInput.split('\n')
  const i = +ip.split(' ')[1]
  return [i, program.map(l => l.split(' '))]
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
  const [i, program] = parseInput(rawInput)
  const reg = Array(6).fill(0)
  console.log(program);

  for (var j = 0; j < 10000000; j++) {
    if (j < 10 || j % 1000000 == 0) {
      console.log(j, reg);
    }
    if (!program[reg[i]]) break
    const [ins, a, b, c] = program[reg[i]]
    inst[ins](+a, +b, +c, reg)
    reg[i]++
  }

  return reg[0]
}

const part2 = (rawInput) => {
  const [i, program] = parseInput(rawInput)
  const reg = Array(6).fill(0)
  reg[0] = 1

  var pred = 0
  const previous = {}
  var calls = {}
  program.forEach((_, i) => calls[i] = 0)
  for (var j = 0; j < 10000000001; j++) {
    /*if (j < 10 || j % 100000 == 0) {
      if (reg[2] != 0) {
        if (pred && pred != reg[2]) {
          console.log(previous);
          console.log(previous[reg[i]]);
          console.log(reg);
          console.log(calls);
          //pred = 0
          throw 1
        }
        if (pred) {
          const diff = 12500
          while (reg[2] + diff < reg[1]) {
            reg[2]+=diff
          }
          pred = 0
        } else {
          pred = reg[2] + 12500
        }
        if (pred) {
        }
      }
    }*/
    if (previous[reg[i]]?.[0] != reg[0]) {
      console.log(previous[3]?.[2] > 10551398-1);
      console.log(previous[3]?.[2]);
      //reg[2] = reg[1]-10
      console.log(program.map((l, i) => i+ ": "+ l.join(" ")));
      console.log(reg[i], program[3]);
      console.log(previous[reg[i]])
      console.log(reg);
      console.log(calls);
      console.log(program[8]);
      console.log(program[9]);
      console.log(program[10]);
    }
    /*if (reg[i] == 3 && previous[3]?.[2] > 10551398-1) {
    }*/
    if (!program[reg[i]]) {
      console.log("FERDIG!");
      break
    }
    calls[reg[i]]++
    previous[reg[i]] = [...reg]

    const i8 = () => {
      reg[2] = Math.max(reg[2]+1, (reg[1] % reg[4] == 0 ? reg[1]/reg[4] : reg[1]) - 10)
      reg[3] = reg[2] > reg[1] ? 1 : 0
      if (reg[2] > reg[1]) {
        reg[5] = 12
      } else {
        /*if (reg[1] % reg[4] == 0) {
          reg[2] = reg[1] / reg[4]
        }*/
        /*reg[1] = 10551398
        reg[2] = 10551399
        reg[5] = 12*/
        reg[5] = 3
        j++
      }
      j+=2
    }

    const i3loop = () => {
      reg[3] = 0
      if (reg[4] * reg[2] != reg[1]) {
        reg[5] = 8
        if (reg[1] % reg[4] == 0) {
          reg[2] = reg[1]-1
        } else {
          reg[2] = reg[1]+1
        }
        //reg[2] = Math.max(reg[2]+1, Math.min(reg[4] * reg[2], reg[1])-1000)
        if (reg[2] > reg[1]) {
          reg[3] = 1
          reg[5] = 12
        } else {
          reg[3] = 0

          reg[5] = 3
          j++
        }
        j+=4
      } else {
        reg[5] = 7
        reg[3] = 1
      }

      j += 2
    }

    const i3 = () => {
      reg[3] = reg[4] * reg[2]
      reg[3] = reg[3] == reg[1] ? 1 : 0
      if (reg[4] * reg[2] != reg[1]) {
        reg[5] = 8
        j++
      } else {
        reg[5] = 7
        reg[3] = 1
      }

      j += 2
    }

    if (reg[5] == 3) {
      i3()
    } else if (reg[5] == 8) {
      i8()
    } else if (reg[5] == 15) {
      reg[5] = 2
    }
    else {
      const [ins, a, b, c] = program[reg[i]]
      inst[ins](+a, +b, +c, reg)
      reg[i]++
    }
  }

  console.log(j);
  console.log(100000001);
  const correctArr = [ 1, 10551398, 1948600, 0, 2, 3 ]
  console.log(correctArr);
  console.log(reg);
  console.log([ 27, 10551398, 1472029, 0, 21, 3 ]);
  console.log(reg.join(', ') == correctArr.join(', '));

  console.log(calls);
  console.log(program.map((l, i) => i+ ": "+ l.join(" ")))
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
