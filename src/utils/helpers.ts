import { App } from '@slack/bolt'
import Log from './logger'

const MODERATOR_COUNT = 2

export const sendMessage = async (channelId: string, message: string, slackAppInstance: App) => {
  await slackAppInstance.client.chat.postMessage({
    channel: channelId,
    text: message,
    link_names: true,
  })
}

export const getModerators = async (channelId: string, slackAppInstance: App) => {
  // get channel member ids
  const { members } = await slackAppInstance.client.conversations.members({ channel: channelId })
  if (!members) {
    Log.error('No channel members found while getting moderators')
    return null
  }

  // pick two random moderators
  const moderators: string[] = []
  while (moderators.length < MODERATOR_COUNT && moderators.length !== members.length) {
    const moderator = members[Math.floor(Math.random() * members.length)]
    if (!moderators.includes(moderator)) {
      moderators.push(moderator)
    }
  }

  return moderators
}
