import { App } from '@slack/bolt'

const CONVERSATION_MEMBERS_LIMIT = 50

export const getChannelMembersIds = async (channelId: string, slackAppInstance: App) => {
  const { members } = await slackAppInstance.client.conversations.members({
    channel: channelId,
    limit: CONVERSATION_MEMBERS_LIMIT,
  })
  if (!members) {
    throw new Error('No channel members found while getting moderators')
  }
  return members
}
