import { AllMiddlewareArgs, App, SlackViewAction, SlackViewMiddlewareArgs } from '@slack/bolt'
import Command from '../../classes/Command'
import { CommandNames } from '../../constants'
import { scheduleCronJob } from '../../utils/cron'
import Log from '../../utils/logger'
import { sendMessage } from '../../utils/messages'
import { getSetupModal } from '../../utils/modals/modalGenerators'
import Prisma from '../../utils/prismaClient'
import { generateErrorMessage, getModalData, validateSetupModalInput } from './validation'

export const handleSetupModalSubmit = async (
  { ack, body }: SlackViewMiddlewareArgs<SlackViewAction> & AllMiddlewareArgs,
  slackAppInstance: App
) => {
  await ack()
  const userInput = getModalData(body)
  const validationResult = validateSetupModalInput(userInput)

  if (validationResult.success) {
    const { channelId, userId, schedule, message, ignoredMembers } = validationResult.data
    const ignoredMembersStringified = JSON.stringify(ignoredMembers)

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
  if (userInput.channelId && userInput.userId) {
    const { channelId, userId } = userInput
    await sendMessage(
      {
        channelId,
        userId,
        text: `⚠️ There was an error with your input:\n${generateErrorMessage(
          validationResult.error
        )}`,
      },
      slackAppInstance
    )
  }
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
