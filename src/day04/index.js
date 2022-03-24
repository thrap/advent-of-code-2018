import run from "aocrunner"

const parseSleep = rawInput => {
  const input = rawInput.split('\n').map(line => {
    const date = /\[(\d+)-(\d+)-(\d+) (\d+):(\d+)\] (.*)/
    const [year, month, day, hour, minute, rest] = line.match(date).slice(1)

    return [new Date(`${year}-${month}-${day}T${hour}:${minute}`), rest]
  }).sort((a, b) => a[0]-b[0])

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
  return [sleep, sleepCount]
}

const maxBy = obj => {
  const max = Math.max(...Object.values(obj))
  return Object.keys(obj).find(x => obj[x] == max)
}

const part1 = (rawInput) => {
  const [sleep, sleepCount] = parseSleep(rawInput)

  const guard = maxBy(sleepCount)
  return guard*maxBy(sleep[guard])
}

const part2 = (rawInput) => {
  const [sleep] = parseSleep(rawInput)

  var max = 0
  var ans = 0
  Object.keys(sleep).forEach(guard => {
    var minute = maxBy(sleep[guard])
    if (sleep[guard][minute] > max) {
      max = sleep[guard][minute]
      ans = guard*minute
    }
  })

  return ans
}

run({
  part1: {
    solution: part1,
  },
  part2: {
    solution: part2,
  },
})
