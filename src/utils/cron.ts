/**
 * Convert Date Object to Cron Expression
 * @param date - The date to convert
 * @returns
 */
export function at(date: Date) {
  const seconds = date.getSeconds()
  const minutes = date.getMinutes()
  const hours = date.getHours()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const dayOfWeek = date.getDay()
  return `${seconds} ${minutes} ${hours} ${day} ${month} ${dayOfWeek}`
}

/**
 * Convert Pattern to Cron Expression
 * @param pattern
 * @returns
 */
export function forTime(pattern: string) {
  return pattern
}
