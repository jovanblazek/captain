import { difference } from 'lodash'

export const filterIgnoredMembers = (members: string[], ignoredMembers: string[]) => {
  const filteredChannelMembers = difference(members, ignoredMembers)
  if (!filteredChannelMembers || !filteredChannelMembers.length) {
    throw new Error('No members left to pick from')
  }
  return filteredChannelMembers
}
