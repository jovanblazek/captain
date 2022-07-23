import { Prisma } from '../../prismaClient'

export const getLastPickedMembers = async (channelId: string) => {
  const cron = await Prisma.cron.findFirst({
    where: { channelId },
  })
  if (!cron) {
    return []
  }
  const lastPickedMembers: string[] = JSON.parse(cron.lastPickedMembers) ?? []
  return lastPickedMembers
}

export const setLastPickedMembers = async (channelId: string, members: string[]) => {
  const cron = await Prisma.cron.findFirst({
    where: { channelId },
  })
  if (!cron) {
    return
  }
  await Prisma.cron.update({
    where: { channelId },
    data: {
      lastPickedMembers: JSON.stringify(members),
    },
  })
}
