import run from "aocrunner"
const abs = Math.abs

const re = /pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)/
const parseLine = l => l.match(re).slice(1).map(x => +x)
const parseInput = rawInput => rawInput.split('\n').map(parseLine)

const part1 = (rawInput) => {
  const nanobots = parseInput(rawInput)

  const max = Math.max(...nanobots.map(x => x[3]))
  const [x0, y0, z0] = nanobots.find(x => x[3] == max)

  const inRange = ([x, y, z]) => abs(x-x0) + abs(y-y0) + abs(z-z0) <= max
  return nanobots.filter(inRange).length
}

const part2 = (rawInput) => {
  const nanobots = parseInput(rawInput)

  const inRangeOf = ([x0, y0, z0]) => {
    var count = 0
    nanobots.forEach(([x, y, z, r]) => {
      if (abs(x-x0) + abs(y-y0) + abs(z-z0) <= r)
        count++
    })
    return count
  }

  const distanceToNext = ([x0, y0, z0]) => {
    var min = Number.MAX_VALUE
    nanobots.forEach(([x, y, z, r]) => {
      const man = abs(x-x0) + abs(y-y0) + abs(z-z0)
      if (man > r)
        min = Math.min(min, man - r)
    })
    return min
  }

  var [xMax, yMax, zMax] = [ 31309239, 15032089, 25143312 ]
  var max = inRangeOf([ xMax, yMax, zMax ])
  var min = xMax + yMax + zMax
  var minDist = distanceToNext([xMax, yMax, zMax])
  var changed = true
  const seen = {}
  var maxFactor = Math.pow(10, 8)
  while (changed) {
    var biggestFactor = 0
    changed = false
    var best = [xMax, yMax, zMax]
    if (seen[best]) break
    seen[best] = true
    for (var factor = maxFactor; factor >= 1; factor /= 10) {
      console.log(factor);
      for (var dx = -9; dx <= 9; dx++) {
        for (var dy = -9; dy <= 9; dy++) {
          for (var dz = -9; dz <= 9; dz++) {
            if (dx == 0 && dy == 0 && dz == 0) continue
            const pos = [xMax+factor*dx, yMax+factor*dy, zMax+factor*dz]
            const inRangeOfDx = inRangeOf(pos)
            if (inRangeOfDx > max) {
              console.log("NY REKORD:", pos);
              console.log("Antall:", inRangeOfDx);
              min = pos[0]+pos[1]+pos[2]
              max = inRangeOfDx
              minDist = Number.MAX_VALUE
              best = pos
              changed = true
            }
            if (inRangeOfDx >= max) {
              const nextDist = distanceToNext(pos)
              if (nextDist <= minDist) {
                minDist = nextDist
                changed = true
                biggestFactor = Math.max(biggestFactor, factor)
                best = pos
              }
            }
            if (inRangeOfDx == max && min > pos[0]+pos[1]+pos[2]) {
              min = pos[0]+pos[1]+pos[2]
              console.log("Ny min:", min);
            }
          }
        }
      }
    }
    maxFactor = biggestFactor;
    [xMax, yMax, zMax] = best
  }

  return min
}

run({
  part1: {
    solution: part1,
  },
  part2: {
    solution: part2,
  },
})
