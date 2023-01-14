export const CommandNames = {
  setup: '/setup',
  list: '/list',
  clear: '/clear',
  pick: '/pick',
  help: '/help',
}

export const ModalIds = {
  setup: 'setupModal',
}

export const BlockIds = {
  setup: {
    cron: 'cron',
    message: 'message',
    ignoredMembers: 'ignoredMembers',
  },
}

export const ActionIds = {
  addToChannelButton: 'addToChannelButton',
}

export const CronTypes = {
  member: 'member',
  text: 'text',
} as const

export type CronType = typeof CronTypes[keyof typeof CronTypes]
