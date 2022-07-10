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
    const { count } = await Prisma.cron.deleteMany({
      where: { channelId: { equals: channelId } },
    })

    if (count > 0) {
      ScheduledJobs.getInstance().removeChannelJobs(channelId)
      await respond('All jobs for this channel have been thrown overboard 🌊 🌊 🌊')
      return
    }
    await respond("No jobs found on the deck. It's a good day to be a captain! 🏝")
  }
)
