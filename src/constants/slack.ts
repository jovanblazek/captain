export const CommandNames = {
  setup: '/setup',
  list: '/list',
  clear: '/clear',
  pick: '/pick',
  help: '/help',
} as const

export const ModalIds = {
  setup: 'setupModal',
} as const

export const BlockIds = {
  setup: {
    cron: 'cron',
    message: 'message',
    ignoredMembers: 'ignoredMembers',
  },
} as const

export const ActionIds = {
  addToChannelButton: 'addToChannelButton',
} as const
