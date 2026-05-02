/**
 * Application status definitions and utilities
 */

export const APPLICATION_STATUSES = [
  'wishlist',
  'applied',
  'assessment',
  'interview',
  'offered',
  'rejected',
] as const

export type ApplicationStatus = typeof APPLICATION_STATUSES[number]

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  wishlist: 'Wishlist',
  applied: 'Dilamar',
  assessment: 'Asesmen',
  interview: 'Interview',
  offered: 'Ditawari',
  rejected: 'Ditolak',
}

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  wishlist: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20',
  applied: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  assessment: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  interview: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  offered: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  rejected: 'text-red-400 bg-red-400/10 border-red-400/20',
}

export const JOB_TYPES = ['remote', 'hybrid', 'onsite'] as const
export type JobType = typeof JOB_TYPES[number]

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  onsite: 'WFO',
}
