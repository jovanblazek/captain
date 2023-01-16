export const CronTypes = {
  member: 'member',
  text: 'text',
} as const

export type CronType = typeof CronTypes[keyof typeof CronTypes]
