export function startOfDay(date: Date): Date {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function startOfWeek(date: Date): Date {
  const day = startOfDay(date)
  const weekday = day.getDay()
  const offset = weekday === 0 ? -6 : 1 - weekday
  return addDays(day, offset)
}

export function atTime(date: Date, hours: number, minutes = 0): Date {
  const next = startOfDay(date)
  next.setHours(hours, minutes, 0, 0)
  return next
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/** Local calendar key, never UTC, so posts never shift a day across timezones. */
export function dateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

export function timeKey(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}

export function fromDateAndTime(day: string, time: string): Date {
  const [year, month, date] = day.split("-").map(Number)
  const [hours, minutes] = time.split(":").map(Number)
  return new Date(year, month - 1, date, hours, minutes, 0, 0)
}

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
})

const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" })
const dayMonthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
})

export function formatTime(date: Date): string {
  return timeFormatter.format(date)
}

export function formatDayHeader(date: Date): string {
  return `${weekdayFormatter.format(date)} ${date.getDate()}`
}

export function formatWeekRange(monday: Date): string {
  const sunday = addDays(monday, 6)

  if (monday.getMonth() === sunday.getMonth()) {
    return `${dayMonthFormatter.format(monday)} – ${sunday.getDate()}, ${sunday.getFullYear()}`
  }

  return `${dayMonthFormatter.format(monday)}, ${monday.getFullYear()} – ${dayMonthFormatter.format(sunday)}, ${sunday.getFullYear()}`
}

export function relativeDayLabel(date: Date, now: Date): string | null {
  const diff = Math.round(
    (startOfDay(date).getTime() - startOfDay(now).getTime()) / 86_400_000,
  )
  if (diff === 0) return "Today"
  if (diff === 1) return "Tomorrow"
  if (diff === -1) return "Yesterday"
  return null
}
