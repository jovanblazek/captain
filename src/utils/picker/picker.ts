import { App } from '@slack/bolt'
import { formatMessage, sendMessage } from '../messages'
import {
  filterBots,
  filterIgnoredMembers,
  getChannelMembersIds,
  getLastPickedMembers,
  getRandomArrayElements,
  setLastPickedMembers,
} from './utils'

const MODERATOR_COUNT = 2

interface PickerOptions {
  channelId: string
  message: string
  ignoredMembers?: string[]
  isLastPickExcluded?: boolean
}

export const picker = async (
  { channelId, message, ignoredMembers = [], isLastPickExcluded }: PickerOptions,
  slackAppInstance: App
) => {
  const channelMembers = await getChannelMembersIds(channelId, slackAppInstance)
  const membersToIgnore = [
    ...ignoredMembers,
    ...(isLastPickExcluded ? await getLastPickedMembers(channelId) : []),
  ]
  const filteredChannelMembers = filterIgnoredMembers(channelMembers, membersToIgnore)
  const humanMembers = await filterBots(filteredChannelMembers, slackAppInstance)
  const moderators = getRandomArrayElements(humanMembers, MODERATOR_COUNT)

  if (!moderators || !moderators.length) {
    await setLastPickedMembers(channelId, []) // TODO test this
    throw new Error('No moderators generated')
  }

  if (isLastPickExcluded) {
    await setLastPickedMembers(channelId, [moderators[0]])
  }

  await sendMessage(
    {
      channelId,
      text: `${formatMessage({ message, moderators })}`,
    },
    slackAppInstance
  )
}
