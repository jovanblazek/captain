import { App } from '@slack/bolt'
import { formatMessage, sendMessage } from '../messages'
import {
  filterBots,
  filterIgnoredMembers,
  getChannelMembersIds,
  getRandomArrayElements,
} from './utils'

const MODERATOR_COUNT = 2

interface PickerOptions {
  channelId: string
  message: string
  ignoredMembers?: string[]
}

export const picker = async (
  { channelId, message, ignoredMembers = [] }: PickerOptions,
  slackAppInstance: App
) => {
  const channelMembers = await getChannelMembersIds(channelId, slackAppInstance)
  const filteredChannelMembers = filterIgnoredMembers(channelMembers, ignoredMembers)
  const humanMembers = await filterBots(filteredChannelMembers, slackAppInstance)
  const moderators = getRandomArrayElements(humanMembers, MODERATOR_COUNT)

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
