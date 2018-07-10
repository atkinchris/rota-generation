const buildScore = require('./fitness')
const printSchedule = require('./print')

const MAXIMUM_ITERATIONS = 1000
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const SHIFTS = [
  { id: 1, name: 'Break Time Duty', group: 'a' },
  { id: 2, name: 'Break Time Detention', group: 'a' },
  { id: 3, name: 'Detention (12:30 - 13:00)', group: 'b' },
  { id: 4, name: 'Detention (13:00 - 13:30)', group: 'b' },
]
const PEOPLE = [
  { id: 1, name: 'Lucy' },
  { id: 2, name: 'Julie B' },
  { id: 3, name: 'Jane' },
  { id: 4, name: 'Julie T' },
  { id: 5, name: 'Victoria' },
]

const shuffle = arr => arr.concat().sort(() => 0.5 - Math.random())

const buildSchedule = () => {
  const week = []

  DAYS.forEach((dayName) => {
    const shuffledPeople = shuffle(PEOPLE)
    const day = {
      name: dayName,
      shifts: [],
    }

    SHIFTS.forEach((shift) => {
      const scores = shuffledPeople
        .map(person => buildScore(person, shift, day, week))
        .filter(s => s.score < 100)
        .sort((a, b) => a.score - b.score)

      let selectedPerson = null
      if (scores.length > 0) {
        selectedPerson = scores[0].person
      }

      day.shifts.push({ shift, person: selectedPerson })
    })

    week.push(day)
  })

  return week
}

const calculateStats = (schedule) => {
  const flattenedShifts = schedule.reduce((out, d) => [...out, ...d.shifts], [])

  const stats = PEOPLE.map((person) => {
    const filteredShifts = flattenedShifts.filter(s => s.person && s.person.id === person.id)
    const counts = []
    let total = 0

    SHIFTS.forEach((shift) => {
      const count = filteredShifts.filter(s => s.shift.id === shift.id).length
      counts.push(count)
      total += count
    })

    return {
      person,
      counts,
      total,
    }
  })

  stats.hasUnavailable = flattenedShifts.includes(s => s.person === null)

  return stats
}

let stats = null
let schedule = null
let iterations = 0

while (
  !stats
  || stats.some(s => s.total !== 4)
  || stats.hasUnavailable
) {
  if (iterations > MAXIMUM_ITERATIONS) {
    throw Error('Maximum attempts reached')
  }

  schedule = buildSchedule()
  stats = calculateStats(schedule)
  iterations += 1
}

printSchedule(schedule, stats)
