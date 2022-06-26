import { App } from '@slack/bolt'
import dayjs from 'dayjs'
import { getModerators, sendMessage } from './helpers'
import Log from './logger'

const getMedal = (place: number) => {
  switch (place) {
    case 1:
      return '🥇'
    case 2:
      return '🥈'
    case 3:
      return '🥉'
    default:
      return `${place}. `
  }
}

const formatMessage = (moderators: string[]) =>
  `${dayjs().format('DD.MM.')} standup moderators:\n${moderators
    .map((moderator, index) => `${getMedal(index + 1)} <@${moderator}>`)
    .join('\n')}`

export const randomPicker = async (channelId: string, slackAppInstance: App) => {
  const moderators = await getModerators(channelId, slackAppInstance)
  if (!moderators || !moderators.length) {
    Log.error('No moderators generated')
    return
  }

  await sendMessage(channelId, `${formatMessage(moderators)}`, slackAppInstance)
}
