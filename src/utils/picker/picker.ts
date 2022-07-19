import { App } from '@slack/bolt'
import { formatMessage, sendMessage } from '../messages'
import { getModerators } from './getModerators'

interface PickerOptions {
  channelId: string
  message: string
  ignoredMembers?: string[]
}

export const picker = async (
  { channelId, message, ignoredMembers = [] }: PickerOptions,
  slackAppInstance: App
) => {
  const moderators = await getModerators({ channelId, ignoredMembers }, slackAppInstance)
  if (!moderators || !moderators.length) {
    throw new Error('No moderators generated')
  }

  await sendMessage(
    {
      channelId,
      text: `${formatMessage({ message, moderators })}`,
    },
    slackAppInstance
  )
}
