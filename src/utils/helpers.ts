import { App } from '@slack/bolt'
import Log from './logger'

const MODERATOR_COUNT = 2
const CONVERSATION_MEMBERS_LIMIT = 50

export const sendMessage = async (channelId: string, message: string, slackAppInstance: App) => {
  await slackAppInstance.client.chat.postMessage({
    channel: channelId,
    text: message,
    link_names: true,
  })
}

export const getModerators = async (channelId: string, slackAppInstance: App) => {
  try {
    // get channel member ids
    const { members: channelMembers } = await slackAppInstance.client.conversations.members({
      channel: channelId,
      limit: CONVERSATION_MEMBERS_LIMIT,
    })
    if (!channelMembers) {
      throw new Error('No channel members found while getting moderators')
    }

    // get profile of every channel member
    const memberProfiles = await Promise.allSettled(
      channelMembers.map((member) =>
        slackAppInstance.client.users.info({
          user: member,
        })
      )
    )

    // filter out members who are not bots
    const humanMembers = memberProfiles.reduce((acc, memberPromise) => {
      if (memberPromise.status === 'fulfilled') {
        const { value: member } = memberPromise
        if (member?.user && !member.user?.is_bot && member.user?.id) {
          return [...acc, member.user.id]
        }
      }
      return acc
    }, [] as string[])

    if (humanMembers.length === 0) {
      throw new Error('No human channel members found while getting moderators')
    }

    // pick two random moderators
    const moderators: string[] = []
    while (moderators.length < MODERATOR_COUNT && moderators.length !== humanMembers.length) {
      const moderator = humanMembers[Math.floor(Math.random() * humanMembers.length)]
      if (!moderators.includes(moderator)) {
        moderators.push(moderator)
      }
    }
    return moderators
  } catch (error) {
    Log.error(error)
    return null
  }
}
