import { AllMiddlewareArgs, App, SlackViewAction, SlackViewMiddlewareArgs } from '@slack/bolt'
import { get } from 'lodash'
import { validate } from 'node-cron'
import { Command } from '../classes'
import { BlockIds, CommandNames } from '../constants'
import { scheduleCronJob } from '../utils/cron'
import { parseJson } from '../utils/formatters'
import Log from '../utils/logger'
import { sendMessage } from '../utils/messages'
import { getSetupModal } from '../utils/modals/modalGenerators'
import Prisma from '../utils/prismaClient'

const getModalData = (body: SlackViewAction) => {
  const values = get(body, ['view', 'state', 'values'])
  return {
    channelId: parseJson(get(body, ['view', 'private_metadata'])) as string,
    userId: get(body, ['user', 'id']),
    schedule: get(values, [BlockIds.setup.cron, BlockIds.setup.cron, 'value'])!,
    message: get(values, [BlockIds.setup.message, BlockIds.setup.message, 'value'])!,
    ignoredMembers: get(
      values,
      [BlockIds.setup.ignoredMembers, BlockIds.setup.ignoredMembers, 'selected_users'],
      []
    ),
  }
}

export const handleSetupModalSubmit = async (
  { ack, body }: SlackViewMiddlewareArgs<SlackViewAction> & AllMiddlewareArgs,
  slackAppInstance: App
) => {
  await ack()
  const { channelId, userId, schedule, message, ignoredMembers } = getModalData(body)
  const ignoredMembersStringified = JSON.stringify(ignoredMembers)

  // If the cron schedule is valid, save it to the database and schedule the job
  if (validate(schedule)) {
    await Prisma.cron.upsert({
      where: { channelId },
      create: { channelId, schedule, message, ignoredMembers: ignoredMembersStringified },
      update: { schedule, message, ignoredMembers: ignoredMembersStringified },
    })
    Log.info(`Upserted cron job for ${channelId} with schedule ${schedule}`)

    scheduleCronJob(schedule, { channelId, ignoredMembers, message }, slackAppInstance)
    await sendMessage({ channelId, userId, text: 'Aye aye sir! 🫡' }, slackAppInstance)
    return
  }
  await sendMessage(
    {
      channelId,
      userId,
      text: 'Cron syntax error. Validate syntax at this <https://crontab.guru/|this site>.',
    },
    slackAppInstance
  )
}

export default new Command(
  {
    name: CommandNames.setup,
    description: 'Setup a scheduled job for this channel',
  },
  async ({ ack, payload }, slackAppInstance) => {
    await ack()

    await slackAppInstance.client.views.open({
      trigger_id: payload.trigger_id,
      view: getSetupModal({ channelId: payload.channel_id }),
    })
  }
)
