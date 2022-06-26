import { Command } from '../classes'
import { CommandNames } from '../constants'
import { Prisma } from '../utils/prismaClient'

export default new Command(
  {
    name: CommandNames.clear,
  },
  async ({ ack, command, respond }, scheduledJobs) => {
    await ack()
    const { channel_id: channelId } = command
    await Prisma.cron.deleteMany({
      where: { channelId: { equals: channelId } },
    })
    // stop existing cron job
    scheduledJobs
      .filter((job) => channelId === job.channelId)
      .forEach((job) => {
        job.cron.stop()
      })
    await respond('Cron jobs removed.')
  }
)
