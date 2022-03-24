import run from "aocrunner"

const part1 = (input) => {
  const ids = input.split('\n')

  const checksum = {}
  ids.forEach(([...x]) => {
    const count = {}
    x.forEach(c => {
      count[c] = (count[c]||0) + 1
    })
    const unique = new Set(Object.values(count))
    unique.forEach(v => {
      checksum[v] = (checksum[v] || 0) + 1
    })
  })

  return checksum[2]*checksum[3]
}

const part2 = (input) => {
  const ids = input.split('\n')

  var min = Number.MAX_VALUE
  var correct = []
  for (var i = 0; i < ids.length; i++) {
    const a = ids[i]
    for (var j = i + 1; j < ids.length; j++) {
      const b = ids[j]
      var diff = 0
      for (var c = 0; c < a.length; c++) {
        if (a[c] != b[c])
          diff++
      }
      if (diff <= min) {
        min = diff
        correct = [a, b]
      }
    }
  }
  const [a, b] = correct
  var str = ''
  for (var c = 0; c < a.length; c++) {
    str += a[c] != b[c] ? '' : a[c]
  }
  return str
}

run({
  part1: {
    solution: part1,
  },
  part2: {
    solution: part2,
  },
})
