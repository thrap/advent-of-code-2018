import run from "aocrunner"
import heapify from "heapify";

const manhattan = ([x0, y0], [x, y]) => {
  return Math.abs(x0-x)+Math.abs(y0-y)
}

const dirs = [[0,1],[1,0],[0,-1],[-1,0]]

const parseInput = rawInput => {
  const grid = rawInput.split('\n').map(l => l.split(''))
  const units = []
  const hp = 200
  const attack = 3
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[0].length; j++) {
      var type = grid[i][j]
      if (/[GE]/.test(type)) {
        units.push({ type, i, j, hp, attack })
        grid[i][j] = '.'
      }
    }
  }
  return [grid, units]
}

const aStar = (grid, start, goal, maxSize=64) => {
  const [goalX, goalY] = goal

  const states = [[...start, 0, 0]]
  var queue = new heapify.MinQueue(maxSize)
  queue.push(0, 0)

  const seen = {}
  while (queue.length) {
    const [x, y, moves] = states[queue.pop()]

    if (x == goalX && y == goalY) {
      return moves
    }

    const pos = dirs.filter(([dx, dy]) => (grid[x + dx]?.[y+dy] == '.'))
    pos.forEach(([dx, dy]) => {
      var man = Math.abs(goalX - (x+dx)) + Math.abs(goalY - (y+dy))

      if (seen[[x+dx,y+dy]])
        return
      seen[[x+dx,y+dy]] = true

      states.push([x+dx, y+dy, moves + 1])
      queue.push(states.length-1, moves+1)
    })

  }
  return Infinity
}

const toStr = (grid, units=[], diff={}) => {
  const unitStr = (i) => {
    const row = units.filter(u => u.i == i).map(u => u.hp).join(' ')
    return row ? "     " + row : ''
  }

  units.forEach(({type, i, j}) => {
    if (!diff[[i,j]])
      diff[[i,j]] = type
  })
  return grid.map((l, i) =>
    l.map((c, j) => diff[[i,j]] || c
  ).join('') + unitStr(i)).join('\n')
}

var printed = {}

const print = (grid, units, diff) => {
  const str = toStr(grid, units, diff)
  if(printed[str]) return
  printed[str] = true
  console.log(str)
  console.log(units);
  console.log()
}


const part1 = (input) => {
  printed = {}
  //console.log(input);
  var PRINTROUND = -1
  if(/\d/.test(input)) {
    PRINTROUND = input.split('\n')[0]
    input = input.split('\n').slice(1).join('\n')
  }

  var [map, units] = parseInput(input)
  var SANITY_SUM = 0


  const move = unit => {
    const gridStr = toStr(map, units).split('\n')
    const grid = gridStr.map(l => l.split(''))
    const isEmpty = ([i, j]) => {
      return grid[i][j] == '.'
    }
    const isEnemy = ([i, j]) => {
      return grid[i][j] == (unit.type == 'G' ? 'E' : 'G')
    }
    const targets = units.filter(t => t.type != unit.type)
    const unitPos = [unit.i, unit.j]
    const diff = {[unitPos]: '█'}

    const around = (unit) => dirs.map(([di, dj]) => [unit.i+di, unit.j+dj])
    const emptyAround = (unit) => around(unit).filter(isEmpty)

    if (around(unit).some(isEnemy)) {
      return
    }

    const range = targets.map(emptyAround).flat().sort((a, b) => manhattan(a, unitPos)-manhattan(b, unitPos))

    range.forEach(([i, j]) => diff[[i,j]] = '?')

    var minLength = Number.MAX_VALUE
    const allCandidates = range.map((pos) => {
      /** OPTIMALISERINGER:
       * SJEKK AT IKKE STUCK
       * Sorter gutta først?
       * */
      if (minLength < manhattan(pos, unitPos))
        return [0, Infinity]

      const distance = aStar(gridStr, unitPos, pos)
      minLength = Math.min(minLength, distance)
      return [pos, distance]
    }).filter(x => x[1] == minLength)
    const candidates = allCandidates.map(x => x[0])


    candidates.forEach(([i, j]) => diff[[i,j]] = '!')
    const chosen = candidates.sort(sort)[0]
    if (!chosen) {
      return
    }
    diff[chosen] = '+'
    SANITY_SUM += 100*chosen[0]+chosen[1]

    const newPos = emptyAround(unit).filter(pos => aStar(gridStr, pos, chosen) == minLength-1).sort(sort)[0]
    if (!newPos) {
      return
    }
    diff[newPos] = '▒'
    if (unit.i == 15 && unit.j == 8 && newPos[1] == 7) {
      console.log(units);
      console.log(newPos);
      diff[[21, 12]] = "$"
      console.log(toStr(map, units, diff))
      console.log(candidates);

      console.log(allCandidates);
      console.log(targets.map(emptyAround).flat().sort((a, b) => manhattan(a, unitPos)-manhattan(b, unitPos)));
      console.log(emptyAround(unit).filter(pos => aStar(gridStr, pos, chosen) == minLength-1));
      console.log(aStar(gridStr, unitPos, [21, 12]));
      throw 1
    }
    //print(grid, units, diff)
    unit.i = newPos[0]
    unit.j = newPos[1]
  }



  const sort = (a, b) => a[0]*100 + a[1] - (b[0]*100 + b[1])

  const attack = (unit) => {
    const targets = units.filter(t => t.type != unit.type && manhattan([unit.i,unit.j],[t.i,t.j]) == 1)
    var minHp = Math.min(...targets.map(t => t.hp))
    const target = targets.filter(t => t.hp == minHp).sort((a, b) => sort([a.i, a.j], [b.i, b.j]))[0]
    if (!target) return

    target.hp -= unit.attack
    if (target.hp <= 0)
      units = units.filter(u => u.hp > 0)
  }

  const act = (unit) => {
    units = units.filter(u => u.hp > 0)
    if (units.every(unit => unit.type == units[0].type)) return false
    if(unit.hp <= 0) {
      return true
    }
    move(unit)
    attack(unit)
    return true
  }

  for (var turns = 0; turns < 1900; turns++) {
    const sorted = units.sort((a, b) => sort([a.i, a.j], [b.i, b.j]))

    if (PRINTROUND != -1 || input.length >= 100)
      console.log("Turn", turns) | print(map, units)
    if (PRINTROUND == turns) {
      return toStr(map, units)
    }

    const acted = sorted.every(act)
    if (units.every(unit => unit.type == units[0].type)) {
      console.log(acted);
      console.log(turns);
      print(map, units)
      console.log();
      console.log((turns) * units.reduce((acc, u) => acc+u.hp, 0));
      console.log((turns+1) * units.reduce((acc, u) => acc+u.hp, 0));
      return ((acted ? 1: 0) + turns) * units.reduce((acc, u) => acc+u.hp, 0)
    }
  }

  console.log(SANITY_SUM);
  console.log(53894);

  return
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)

  return
}

run({
  part1: {
    tests: [
      { input: `#######
#E..G.#
#...#.#
#.G.#G#
#######`, expected: '' },
      { input: `#########
#G..G..G#
#.......#
#.......#
#G..E..G#
#.......#
#.......#
#G..G..G#
#########`, expected: '' },
{ input: `#######
#G..#E#
#E#E.E#
#G.##.#
#...#E#
#...E.#
#######`, expected: 36334 },
{ input: `#######
#E..EG#
#.#G.E#
#E.##E#
#G..#.#
#..E#.#
#######`, expected: 39514 },
{ input: `#######
#.E...#
#.#..G#
#.###.#
#E#G#G#
#...#G#
#######`, expected: 28944 },
{ input: `#########
#G......#
#.E.#...#
#..##..G#
#...##..#
#...#...#
#.G...G.#
#.....G.#
######### `, expected: 18740 },
{ input: `#######
#.G...#
#...EG#
#.#.#G#
#..G#E#
#.....#
#######`, expected: 27730 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
    ],
    solution: part2,
  },
  onlyTests: false,
})
