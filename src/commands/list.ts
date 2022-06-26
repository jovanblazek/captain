import { Command } from '../classes'
import { CommandNames } from '../constants'
import { Prisma } from '../utils/prismaClient'

export default new Command(
  {
    name: CommandNames.list,
    description: 'List all scheduled jobs for this channel',
  },
  async ({ ack, command, respond }) => {
    await ack()
    const cronJobs = await Prisma.cron.findMany({
      where: { channelId: { equals: command.channel_id } },
    })
    const cronJobText =
      cronJobs.map(({ schedule }, index) => `${index + 1}. \`${schedule}\``).join('\n') ||
      'No cron jobs found.'
    await respond(cronJobText)
  }
)
