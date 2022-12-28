import Command from 'classes/Command'
import Prisma from 'utils/prismaClient'
import { CommandNames } from '../../constants'

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
        .map(({ schedule, name }, index) => `${index + 1}. \`${schedule}\` - ${name}`)
        .join('\n') || 'No scheduled jobs found. The map is definitely upside down 🗺 🤔'
    await respond(cronJobText)
  }
)
