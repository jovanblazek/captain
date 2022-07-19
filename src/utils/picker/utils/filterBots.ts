import { App } from '@slack/bolt'

export const filterBots = async (members: string[], slackAppInstance: App) => {
  const memberProfiles = await Promise.allSettled(
    members.map((member) =>
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

  if (!humanMembers.length) {
    throw new Error('No human channel members found while getting moderators')
  }
  return humanMembers
}
