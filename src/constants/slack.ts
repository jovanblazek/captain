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
  setupModal: {
    cronType: 'cronType',
    cron: 'cron',
    message: 'message',
    memberCron: {
      ignoredMembers: 'ignoredMembers',
    },
    textCron: {
      sourceText: 'sourceText',
    },
  },
} as const

export const ActionIds = {
  addToChannelButton: 'addToChannelButton',
  setupModal: {
    cronType: 'cronType',
    cron: 'cron',
    message: 'message',
    memberCron: {
      ignoredMembers: 'ignoredMembers',
    },
    textCron: {
      sourceText: 'sourceText',
    },
  },
} as const
