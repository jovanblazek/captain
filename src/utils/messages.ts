import { App } from '@slack/bolt'
import dayjs from 'dayjs'

interface SendMessageOptions {
  channelId: string
  userId?: string
  text: string
}

export const sendMessage = async (
  { channelId, userId, text }: SendMessageOptions,
  slackAppInstance: App
) => {
  if (userId) {
    await slackAppInstance.client.chat.postEphemeral({
      channel: channelId,
      user: userId,
      text,
      link_names: true,
    })
    return
  }
  await slackAppInstance.client.chat.postMessage({
    channel: channelId,
    text,
    link_names: true,
  })
}

export const getMedal = (place: number) => {
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

// function that replaces {{date}} with the current date
export const replaceDate = (message: string) =>
  message.replace(/\{\{date\}\}/g, dayjs().format('DD.MM.'))

export const formatMessage = ({ message, moderators }: { message: string; moderators: string[] }) =>
  `${replaceDate(message)}\n${moderators
    .map((moderator, index) => `${getMedal(index + 1)} <@${moderator}>`)
    .join('\n')}`
