import { App } from '@slack/bolt'
import dayjs from 'dayjs'
import { getModerators, sendMessage } from './helpers'

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

// function that replaces {{date}} with the current date
const replaceDate = (message: string) => message.replace(/\{\{date\}\}/g, dayjs().format('DD.MM.'))

const formatMessage = ({ message, moderators }: { message: string; moderators: string[] }) =>
  `${replaceDate(message)}\n${moderators
    .map((moderator, index) => `${getMedal(index + 1)} <@${moderator}>`)
    .join('\n')}`

export const randomPicker = async ({
  channelId,
  message,
  slackAppInstance,
}: {
  channelId: string
  message: string
  slackAppInstance: App
}) => {
  const moderators = await getModerators(channelId, slackAppInstance)
  if (!moderators || !moderators.length) {
    throw new Error('No moderators generated')
  }

  await sendMessage(channelId, `${formatMessage({ message, moderators })}`, slackAppInstance)
}
