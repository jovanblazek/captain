import { Command } from '../classes'
import { CommandNames } from '../constants'
import Prisma from '../utils/prismaClient'

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
      cronJobs
        .map(({ schedule, message }, index) => `${index + 1}. \`${schedule}\` - ${message}`)
        .join('\n') || 'No sheduled jobs found. The map is definitely upside down 🗺 🤔'
    await respond(cronJobText)
  }
)
