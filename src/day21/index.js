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

const execute = (input, reg0, limit, printCalls = false) => {
  const [i, program] = parseInput(input)
  const reg = Array(6).fill(0)
  reg[0] = reg0

  const calls = {}
  program.forEach((_, i) => calls[i] = 0)
  for (var j = 0; j < limit; j++) {
    if (!program[reg[i]]) {
      if (printCalls) {
        console.log(calls)
        console.log(reg);
      }
      return j
    }

    calls[reg[i]]++
    if (reg[2] == 18) {
      if (reg[4] <= reg[3]) {
        const missing = Math.floor(reg[3]/256) - reg[1]
        reg[1] = Math.floor(reg[3]/256)
        j+=7*missing
      }
      reg[4] = 1
      reg[3] = reg[1]
      reg[2] = 8
      j+=6
    } else if (reg[2] == 8) {
      /*
      (16777215).toString(2)
      '111111111111111111111111'
      */
      //reg[1] = reg[3] & 255
      reg[1] = reg[3] % 256
      reg[5] = reg[1] + reg[5]
      reg[5] = reg[5] % 16777216
      reg[5] = reg[5] * 65899
      //reg[5] = reg[5] & 16777215
      reg[5] = reg[5] % 16777216
      reg[1] = 256 > reg[3] ? 1 : 0
      if (256 > reg[3]) {
        reg[1] = reg[5] == reg[0] ? 1 : 0
        if (reg[5] == reg[0]) {
          reg[2] = 31
          //return j+7
          /** HER ER DEN FERDIG */
        } else {
          j+=3
          reg[3] = reg[5] | 65536
          reg[5] = 9010242
          reg[2] = 8
        }
      } else {
        reg[1] = Math.floor(reg[3]/256)
        j+=7*reg[1]
        reg[4] = 1
        reg[3] = reg[1]
        reg[2] = 8
        j+=6
      }
      j+=9
    } else {
      const [ins, a, b, c] = program[reg[i]]
      inst[ins](a, b, c, reg)
      reg[i]++
    }
  }
  if (printCalls) {
    const expected = [ 15, 46498, 18, 11903730, 0, 2656444 ]
    console.log(calls);
    console.log(j);
    console.log(reg);
    console.log(expected);
    console.log(reg.join() == expected.join());
  }
  return j
}

const executeBrute = (input, reg0, limit) => {
  const [i, program] = parseInput(input)
  const reg = Array(6).fill(0)
  reg[0] = reg0

  const calls = {}
  program.forEach((_, i) => calls[i] = 0)
  for (var j = 0; j < limit; j++) {
    if (!program[reg[i]]) return j
    const [ins, a, b, c] = program[reg[i]]
    inst[ins](a, b, c, reg)
    reg[i]++
  }
  return j
}

const part1 = (rawInput) => {
  execute(rawInput, 15)
  const [i, program] = parseInput(rawInput)
  console.log("POINTER:", i);
  for (var j = 0; j < program.length; j++) {
    console.log(j, program[j]);
  }
  console.log();
  /*var limit = 37549940
  var answer
  for(var j = 0; j < 100000000; j++) {
    if (j % 100000 == 0)
      console.log(j);
    const ans = execute(rawInput, j, limit)
    if (ans < limit) {
      console.log(j, ans);
      answer = j
      limit = ans
      console.log(execute(rawInput, 712));
      console.log("HURRA", j);
    }
  }
  // 973912 too low
  return answer*/

  test(rawInput, 973912, 5687661)
  test(rawInput, 2475507, 5587661)
  test(rawInput, 5500417, 5587661)
  test(rawInput, 6619857, 5587361)
  //test(rawInput, 10, 5587673)
  test(rawInput, 10, 5616100)
  return 6619857
}

const test = (rawInput, i, upper = 5587661) => {
  const a = execute(rawInput, i, upper)
  const b = executeBrute(rawInput, i, upper)
  if (a != b) {
    console.log("ULIKE");
    console.log(i);
    console.log(a);
    console.log(b);
    throw 1
  }
}

const part2 = (rawInput) => {
  var limit = 10000000000
  /*var answer
  for(var j = 0; j < 1000000; j++) {
    if (j % 100 == 0)
      console.log(j);
    const ans = execute(rawInput, j, limit)
    if (ans < limit) {
      console.log(j, ans);
      answer = j
      console.log(execute(rawInput, 712));
      console.log("HURRA", j);
    }
  }*/

  console.log(execute(rawInput, 6619857, 100000000000, true))
  console.log(execute(rawInput, 7061, 100000000000, true))
  console.log(execute(rawInput, 712, 100000000000, true))
  console.log(execute(rawInput, 952, 100000000000, true))
  console.log(execute(rawInput, 2312, 100000000000, true))
  console.log(execute(rawInput, 2975, 100000000000, true))
  console.log(execute(rawInput, 2312, 100000000000, true))
  //console.log(execute(rawInput, 363, 100000000000, true))
  console.log([6619857, 7061, 712, 952, 2312, 2975, 2312].map(x => x.toString(2)));
  return
}

run({
  part1: {
    solution: part1,
  },
  part2: {
    solution: part2,
  },
})
