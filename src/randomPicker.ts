import { App } from '@slack/bolt'
import dayjs from 'dayjs'
import { getModerators, sendMessage } from './utils/helpers'
import Log from './utils/logger'

export const randomPicker = async (channelId: string, SlackAppInstance: App) => {
  const moderators = await getModerators(channelId, SlackAppInstance)
  if (!moderators || !moderators.length) {
    Log.error('No moderators generated')
    return
  }

  await sendMessage(
    channelId,
    `${dayjs().format('DD.MM.')} standup moderators:\n ${moderators
      .map((moderator, index) => `${index + 1}. <@${moderator}>`)
      .join('\n')}`,
    SlackAppInstance
  )
}
