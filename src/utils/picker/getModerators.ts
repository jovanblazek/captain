import { App } from '@slack/bolt'
import Log from '../logger'
import {
  filterBots,
  filterIgnoredMembers,
  getChannelMembersIds,
  getRandomArrayElements,
} from './utils'

const MODERATOR_COUNT = 2

export const getModerators = async (
  { channelId, ignoredMembers = [] }: { channelId: string; ignoredMembers?: string[] },
  slackAppInstance: App
) => {
  try {
    const channelMembers = await getChannelMembersIds(channelId, slackAppInstance)
    const filteredChannelMembers = filterIgnoredMembers(channelMembers, ignoredMembers)
    const humanMembers = await filterBots(filteredChannelMembers, slackAppInstance)
    return getRandomArrayElements(humanMembers, MODERATOR_COUNT)
  } catch (error) {
    Log.error(error)
    return null
  }
}
