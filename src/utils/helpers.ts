import { App } from '@slack/bolt'
import Log from './logger'

export const sendMessage = async (channelId: string, message: string, SlackAppInstance: App) => {
  await SlackAppInstance.client.chat.postMessage({
    channel: channelId,
    text: message,
    link_names: true,
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getYesterdaysModeratorId = async (channelId: string, SlackAppInstance: App) => {
  try {
    const history = await SlackAppInstance.client.conversations.history({
      channel: channelId,
      limit: 1,
    })

    if (!history.messages || !history.messages.length || !history.messages[0].text) {
      Log.warn('No history messages found')
      return null
    }
    // get substring separated by '<@' and '>'
    return history.messages[0].text.split('<@')[1].split('>')[0] || null
  } catch (error) {
    Log.error(error)
    return null
  }
}

export const getModerators = async (channelId: string, SlackAppInstance: App) => {
  // get channel member ids
  const { members } = await SlackAppInstance.client.conversations.members({ channel: channelId })
  if (!members) {
    Log.error('No channel members found while getting moderators')
    return null
  }

  // remove yesterdays moderator from members
  // TODO investigate if this is necessary
  // const yesterdaysModeratorId = await getYesterdaysModeratorId(channelId, SlackAppInstance)
  // if (yesterdaysModeratorId) {
  //   const yesterdaysModeratorIdIndex = members.indexOf(yesterdaysModeratorId)
  //   if (yesterdaysModeratorIdIndex > -1) {
  //     members.splice(yesterdaysModeratorIdIndex, 1)
  //   }
  // }

  // pick three random moderators
  const moderators: string[] = []
  while (moderators.length < 3 && moderators.length !== members.length) {
    const moderator = members[Math.floor(Math.random() * members.length)]
    if (!moderators.includes(moderator)) {
      moderators.push(moderator)
    }
  }

  return moderators
}
