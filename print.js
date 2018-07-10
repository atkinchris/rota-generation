const NEWLINE = '\r\n'
const shiftToString = s => `${s.shift.name}: ${s.person ? s.person.name : 'UNAVAILABLE'}`
const dayToString = d => [d.name, ...d.shifts.map(shiftToString)].join(NEWLINE)

const printSchedule = (schedule, stats) => {
  const rota = schedule.map(dayToString).join(`${NEWLINE}${NEWLINE}`)
  console.log(rota)
  console.log(NEWLINE)
  console.log(NEWLINE)
  console.log([
    // ['Name', ...SHIFTS.map(s => s.name), 'Total'].join(',\t'),
    ...stats.map(s => [s.person.name.padEnd(8, ' '), ...s.counts, s.total].join(', ')),
  ].join(NEWLINE))
}

module.exports = printSchedule
