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
  const states = [[...start, 0]]
  var queue = new heapify.MinQueue(maxSize)
  queue.push(0, 0)

  const seen = {}
  while (queue.length) {
    const [x, y, moves] = states[queue.pop()]

    if (x == goalX && y == goalY) {
      return moves
    }

    dirs.forEach(([dx, dy]) => {
      var key = grid.length*(x+dx) + y+dy
      if(!(grid[x + dx]?.[y+dy] == '.') || seen[key] <= moves + 1) return

      var man = Math.abs(goalX - (x+dx)) + Math.abs(goalY - (y+dy))

      seen[key] = moves + 1

      states.push([x+dx, y+dy, moves + 1])
      queue.push(states.length-1, moves + 1 + man)
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

const simulate = (map, units, part2) => {
  const move = unit => {
    const gridStr = toStr(map, units).split('\n')
    const grid = gridStr.map(l => l.split(''))
    const isEmpty = ([i, j]) => {
      return grid[i][j] == '.'
    }
    const isEnemy = ([i, j]) => {
      return grid[i][j] == (unit.type == 'G' ? 'E' : 'G')
    }

    const around = (unit) => dirs.map(([di, dj]) => [unit.i+di, unit.j+dj])
    if (around(unit).some(isEnemy)) {
      return
    }

    const targets = units.filter(t => t.type != unit.type)
    const unitPos = [unit.i, unit.j]
    const emptyAround = (unit) => around(unit).filter(isEmpty)

    const range = targets.map(emptyAround).flat().sort((a, b) => manhattan(a, unitPos)-manhattan(b, unitPos))

    var minLength = Number.MAX_VALUE
    const candidates = range.map((pos) => {
      if (minLength < manhattan(pos, unitPos))
        return [0, Infinity]
      const distance = aStar(gridStr, unitPos, pos)
      minLength = Math.min(minLength, distance)
      return [pos, distance]
    }).filter(x => x[1] == minLength).map(x => x[0])

    const chosen = candidates.sort(sort)[0]
    if (!chosen) {
      return
    }
    const newPos = emptyAround(unit).filter(pos => aStar(gridStr, pos, chosen) == minLength-1).sort(sort)[0]

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
    if (part2 && target.hp <= 0 && target.type == 'E') throw 1
    if (target.hp <= 0)
      units = units.filter(u => u.hp > 0)
  }

  const act = (unit) => {
    if (units.every(unit => unit.type == units[0].type)) return false
    if(unit.hp <= 0) {
      return true
    }
    move(unit)
    attack(unit)
    return true
  }

  for (var turns = 0; true; turns++) {
    const sorted = units.sort((a, b) => sort([a.i, a.j], [b.i, b.j]))

    const acted = sorted.every(act)
    if (units.every(unit => unit.type == units[0].type)) {
      return ((acted ? 1: 0) + turns) * units.reduce((acc, u) => acc+u.hp, 0)
    }
  }
}

const part1 = (input) => {
  var [map, units] = parseInput(input)

  return simulate(map, units)
}

const part2 = (input) => {
  var [map, units] = parseInput(input)

  var high = 100
  var low = 3
  const results = {}
  while (high > low) {
    var mid = Math.ceil((high + low)/2)
    try {
      const res = simulate(map, units.map(u => u.type == 'E' ? {...u, attack:mid} : ({...u})), true)
      results[mid] = res
      high = mid-1
    } catch (e) {
      low = mid
    }
  }

  return results[Math.min(...Object.keys(results))]
}

run({
  part1: {
    solution: part1,
  },
  part2: {
    solution: part2,
  },
})
