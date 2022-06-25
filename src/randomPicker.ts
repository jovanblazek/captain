import { App } from '@slack/bolt'
import dayjs from 'dayjs'
import { getChannelByName, getModerators, sendMessage } from './utils/helpers'
import Log from './utils/logger'

export const randomPicker = async (channelName: string, SlackAppInstance: App) => {
  const { id: channelId } = await getChannelByName(channelName, SlackAppInstance)
  if (!channelId) {
    Log.error(`Channel ${channelName} not found`)
    return
  }

  const moderators = await getModerators(channelId, SlackAppInstance)
  if (!moderators || !moderators.length) {
    Log.error('No moderators generated')
    return
  }

  await sendMessage(
    channelId,
    `Dnes ${dayjs().format('DD.MM.')} moderuje standup:\n ${moderators
      .map((moderator, index) => `${index + 1}. <@${moderator}>`)
      .join('\n')}`,
    SlackAppInstance
  )
}
