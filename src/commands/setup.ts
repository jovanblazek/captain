import { AllMiddlewareArgs, App, SlackViewAction, SlackViewMiddlewareArgs } from '@slack/bolt'
import { get } from 'lodash'
import { validate } from 'node-cron'
import { Command } from '../classes'
import ScheduledJobs from '../classes/ScheduledJobs'
import { BlockIds, CommandNames } from '../constants'
import { scheduleCronJob } from '../utils/cron'
import { sendEphermalMessage } from '../utils/helpers'
import Log from '../utils/logger'
import { getSetupModal } from '../utils/modalGenerators'
import { Prisma } from '../utils/prismaClient'

export const handleSetupModalSubmit = async (
  { ack, body }: SlackViewMiddlewareArgs<SlackViewAction> & AllMiddlewareArgs,
  slackAppInstance: App
) => {
  await ack()
  const values = get(body, ['view', 'state', 'values'])
  const schedule = get(values, [BlockIds.setup.cron, BlockIds.setup.cron, 'value'])!
  // TODO add message functionality
  const message = get(values, [BlockIds.setup.message, BlockIds.setup.message, 'value'])!

  const { channelId }: { channelId: string } = JSON.parse(body.view.private_metadata) ?? {}

  if (validate(schedule)) {
    await Prisma.cron.upsert({
      where: { channelId },
      create: { channelId, schedule },
      update: { schedule },
    })

    ScheduledJobs.getInstance().removeChannelJobs(channelId)
    scheduleCronJob({ channelId, schedule }, slackAppInstance)

    Log.info(`Upserted cron job for ${channelId} with schedule ${schedule}`)
    await sendEphermalMessage(channelId, body.user.id, 'Cron job scheduled.', slackAppInstance)
    return
  }
  await sendEphermalMessage(
    channelId,
    body.user.id,
    'Cron syntax error. Validate syntax at this <https://crontab.guru/|this site>.',
    slackAppInstance
  )
}

export default new Command(
  {
    name: CommandNames.setup,
    description: 'Setup a cron job for this channel',
  },
  async ({ ack, payload }, slackAppInstance) => {
    await ack()

    await slackAppInstance.client.views.open({
      trigger_id: payload.trigger_id,
      view: getSetupModal({ channelId: payload.channel_id }),
    })
  }
)
