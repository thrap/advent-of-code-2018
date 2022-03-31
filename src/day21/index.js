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

const execute = (input, reg0, limit) => {
  const [i, program] = parseInput(input)
  const reg = Array(6).fill(0)
  reg[0] = reg0

  const calls = {}
  program.forEach((_, i) => calls[i] = 0)
  for (var j = 0; j < limit; j++) {
    calls[reg[i]]++
    /*if ((j+1) % 100000 == 0) {
      console.log(reg[i], ins, a, b, c, reg);
    }*/
    var start
    if (reg[2] == 18) {
      reg[4] = reg[1] + 1
      reg[4] = reg[4] * 256
      j+=3
      if (reg[4] > reg[3]) {
        /*console.log(j, start, ((j-start[0])/start[1]));
        console.log(reg[1] == Math.floor(reg[3]/256));*/
        if (start[2] != j) {
          console.log(start[2]);
          console.log(j);
          throw 1
        }
        start = null
        if (reg[1] != Math.floor(reg[3]/256)) throw 1
        reg[4] = 1
        reg[2] = 23
      } else {
        const missing = Math.floor(reg[3]/256) - reg[1]
        if (!start)
          start = [j, missing, j+7*missing]
        if (true) {
          reg[1] = Math.floor(reg[3]/256)
          j+=7*missing
          j-=7
        } else {
          reg[1]++
        }
        reg[4] = 0
        reg[2] = 18
        j+=3
      }
    } else if (reg[2] == 23) {
      reg[2] = 26
    }else {
      if (!program[reg[i]]) return j
      const [ins, a, b, c] = program[reg[i]]
      inst[ins](a, b, c, reg)
      reg[i]++
    }
  }
  if (false) {
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
  if (false) {
    const expected = [ 15, 46498, 18, 11903730, 0, 2656444 ]
    console.log(calls);
    console.log(j);
    console.log(reg);
    console.log(expected);
    console.log(reg.join() == expected.join());
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
  console.log(execute(rawInput, 973912, 5587661));
  console.log(executeBrute(rawInput, 973912, 5587661));
  console.log(execute(rawInput, 2475507, 5587661));
  console.log(executeBrute(rawInput, 2475507, 5587661));
  console.log(execute(rawInput, 5500417, 5587661));
  console.log(executeBrute(rawInput, 5500417, 5587661));
  console.log(execute(rawInput, 6619857, 5587661));
  console.log(executeBrute(rawInput, 6619857, 5587661));
  return 6619857
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)

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
