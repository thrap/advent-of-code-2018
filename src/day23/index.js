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

  const inRangeOf = ([x0, y0, z0], print) => {
    const inRange = ([x, y, z, r]) => abs(x-x0) + abs(y-y0) + abs(z-z0) <= r
    const slingring = ([x, y, z, r]) => [abs(x-x0) + abs(y-y0) + abs(z-z0) - r, [x, y, z, r]]
    if (print) {
      const missing = nanobots.filter(p => !inRange(p)).map(slingring).sort((a, b) => a[0]-b[0])
      const included = nanobots.filter(p => inRange(p)).map(slingring).sort((a, b) => b[0]-a[0])
      console.log(missing.slice(0, 40))
      console.log(included.slice(0, 15));
    }
    return nanobots.filter(inRange).length
  }

  const distanceToNext = ([x0, y0, z0]) => {
    const inRange = ([x, y, z, r]) => abs(x-x0) + abs(y-y0) + abs(z-z0) <= r
    const slingring = ([x, y, z, r]) => abs(x-x0) + abs(y-y0) + abs(z-z0) - r
    const missing = nanobots.filter(p => !inRange(p)).map(slingring).sort((a, b) => a-b)[0]//.slice(0, 10).reduce((acc, x) => acc + x)
    return missing
  }

  const distanceToNextall = ([x0, y0, z0]) => {
    const inRange = ([x, y, z, r]) => abs(x-x0) + abs(y-y0) + abs(z-z0) <= r
    const slingring = ([x, y, z, r]) => abs(x-x0) + abs(y-y0) + abs(z-z0) - r
    const missing = nanobots.filter(p => !inRange(p)).map(slingring).sort((a, b) => a-b)
    return missing
  }

  var [xMax, yMax, zMax] = [ 11309240, 15032338, 25143064 ]
  var max = inRangeOf([ xMax, yMax, zMax ])
  var min = xMax + yMax + zMax

  var minDist = distanceToNextall([xMax, yMax, zMax])
  for (var factor = Math.pow(10, 8); factor >= 1; factor /= 10) {
    var best = [xMax, yMax, zMax]
    console.log(factor);
    for (var dx = -10; dx <= 10; dx++) {
      for (var dy = -10; dy <= 10; dy++) {
        for (var dz = -10; dz <= 10; dz++) {
          const pos = [xMax+factor*dx, yMax+factor*dy, zMax+factor*dz]
          const inRangeOfDx = inRangeOf(pos)
          if (inRangeOfDx > max) {
            console.log("NY REKORD:", pos);
            console.log("Antall:", inRangeOfDx);
            min = pos[0]+pos[1]+pos[2]
            max = inRangeOfDx
          }
          if (inRangeOfDx >= max) {
            min = pos[0]+pos[1]+pos[2]
            max = inRangeOfDx
            console.log(dx, dy, dz, inRangeOfDx);
            const nextDist = distanceToNextall(pos)
            if (nextDist <= minDist) {
              minDist = nextDist
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
    [xMax, yMax, zMax] = best
  }

  return min
}

const part1Input = `pos=<0,0,0>, r=4
pos=<1,0,0>, r=1
pos=<4,0,0>, r=3
pos=<0,2,0>, r=1
pos=<0,5,0>, r=3
pos=<0,0,3>, r=1
pos=<1,1,1>, r=1
pos=<1,1,2>, r=1
pos=<1,3,1>, r=1`
const part2Input = part1Input
run({
  part1: {
    tests: [
      { input: part1Input, expected: '' },
    ],
    solution: part1,
  },
  part2: {
    solution: part2,
  },
  onlyTests: false,
})
