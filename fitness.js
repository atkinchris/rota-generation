const buildScore = (person, shift, day, week) => {
  let score = 0

  // Has existing shift that day in same group slot
  if (day.shifts.some(s => s.person.id === person.id && s.shift.group === shift.group)) {
    score += 100
  }

  // Is Julie or Jane on a Tuesday
  if (day.name === 'Tuesday' && (person.id === 2 || person.id === 3)) {
    if (shift.id === 4) {
      score += 100
    } else {
      score += 10
    }
  }

  // Lucy cannot do breaktime
  if (person.id === 1 && shift.group === 'a') {
    score += 100
  }

  // Has existing shift that day in another slot
  if (day.shifts.some(s => s.person.id === person.id)) {
    score += 50
  }

  // Add points for each shift the person already has that week
  const weeksShifts = week
    .reduce((out, d) => [...out, ...d.shifts], [])
    .filter(s => s.person.id === person.id)

  // Add 10 for each shift the person already has
  score += weeksShifts.length * 10

  // Add 10 for each shift the person already has from the same group
  score += weeksShifts.filter(s => s.shift.group === shift.group).length * 10

  // Add 10 for every lunchtime shift the person has
  score += weeksShifts.filter(s => s.shift.group === 'b').length * 10

  // Forbid having more than two of the same shifts
  if (weeksShifts.filter(s => s.shift.id === shift.id).length >= 2) {
    score += 100
  }

  // Forbid having more than four shifts
  if (weeksShifts.length >= 4) {
    score += 100
  }

  return {
    person,
    score,
  }
}

module.exports = buildScore
