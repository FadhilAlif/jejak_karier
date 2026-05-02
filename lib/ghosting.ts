/**
 * Ghosting detection utility.
 * Returns true if an application has been stagnant in a watchable status
 * (applied, interview) for more than the threshold days.
 */

const GHOSTING_THRESHOLD_DAYS = 10

export function isGhosting(lastActivityDate: string | null, status: string): boolean {
  if (!lastActivityDate) return false

  const watchableStatuses = ['applied', 'interview']
  if (!watchableStatuses.includes(status)) return false

  const lastActivity = new Date(lastActivityDate)
  const now = new Date()
  const diffMs = now.getTime() - lastActivity.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  return diffDays >= GHOSTING_THRESHOLD_DAYS
}

export function getGhostingDays(lastActivityDate: string | null): number {
  if (!lastActivityDate) return 0

  const lastActivity = new Date(lastActivityDate)
  const now = new Date()
  const diffMs = now.getTime() - lastActivity.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}
