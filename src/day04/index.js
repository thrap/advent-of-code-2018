import run from "aocrunner"

const parseInput = rawInput => rawInput.split('\n').map(line => {
  const date = /\[(\d+)-(\d+)-(\d+) (\d+):(\d+)\] (.*)/
  const [year, month, day, hour, minute, rest] = line.match(date).slice(1)

  return [new Date(`${year}-${month}-${day}T${hour}:${minute}`), rest]
})

const part1 = (rawInput) => {
  const input = parseInput(rawInput).sort((a, b) => a[0]-b[0])

  const begin = /Guard #(\d+) begins shift/
  const sleep = {}
  const sleepCount = {}
  for (var i = 0; i < input.length; i++) {
    const guard = input[i][1].match(begin)[1]
    sleep[guard] = sleep[guard] || {}
    while (i + 1 < input.length && !begin.test(input[i+1][1])) {
      i++
      const startSleep = input[i][0].getMinutes()
      const endSleep = input[i+1][0].getMinutes()
      for (var minute = startSleep; minute < endSleep; minute++) {
        sleep[guard][minute] = (sleep[guard][minute] || 0) + 1
        sleepCount[guard] = (sleepCount[guard] || 0) + 1
      }
      i++
    }
  }

  const guard = maxBy(sleepCount)

  return guard*maxBy(sleep[guard])
}

const maxBy = obj => {
  const max = Math.max(...Object.values(obj))
  return Object.keys(obj).find(x => obj[x] == max)
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)

  return
}

const part1Input = `[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
[1518-11-02 00:40] falls asleep
[1518-11-02 00:50] wakes up
[1518-11-03 00:05] Guard #10 begins shift
[1518-11-03 00:24] falls asleep
[1518-11-03 00:29] wakes up
[1518-11-04 00:02] Guard #99 begins shift
[1518-11-04 00:36] falls asleep
[1518-11-04 00:46] wakes up
[1518-11-05 00:03] Guard #99 begins shift
[1518-11-05 00:45] falls asleep
[1518-11-05 00:55] wakes up`
const part2Input = part1Input
run({
  part1: {
    tests: [
      { input: part1Input, expected: '' },
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
