import { Command } from '../classes'
import ScheduledJobs from '../classes/ScheduledJobs'
import { CommandNames } from '../constants'
import { Prisma } from '../utils/prismaClient'

export default new Command(
  {
    name: CommandNames.clear,
    description: 'Clear all scheduled jobs for this channel',
  },
  async ({ ack, command, respond }) => {
    await ack()
    const { channel_id: channelId } = command
    await Prisma.cron.deleteMany({
      where: { channelId: { equals: channelId } },
    })

    ScheduledJobs.getInstance().removeChannelJobs(channelId)
    await respond('Cron jobs removed.')
  }
)
