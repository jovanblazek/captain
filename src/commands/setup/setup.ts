import { AllMiddlewareArgs, App, SlackViewAction, SlackViewMiddlewareArgs } from '@slack/bolt'
import Command from 'classes/Command'
import { scheduleMemberCron } from 'cron/crons'
import Log from 'utils/logger'
import { sendMessage } from 'utils/messages'
import { getSetupModal } from 'utils/modals/modalGenerators'
import Prisma from 'utils/prismaClient'
import { CommandNames } from '../../constants'
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

    const savedCron = await Prisma.cron.upsert({
      where: {
        id: 10, // TODO change for real value
      },
      create: {
        channelId,
        schedule,
        message,
        MembersCron: {
          create: {
            ignoredMembers: ignoredMembersStringified,
          },
        },
      },
      update: {
        schedule,
        message,
        MembersCron: {
          update: {
            ignoredMembers: ignoredMembersStringified,
          },
        },
      },
      include: {
        MembersCron: true,
      },
    })
    Log.info(`Upserted cron job for ${channelId} with schedule ${schedule}`)

    scheduleMemberCron(savedCron, {
      ignoredMembers: savedCron.MembersCron?.ignoredMembers,
      slackAppInstance,
    })

    // scheduleCronJob(schedule, { channelId, ignoredMembers, message }, slackAppInstance)
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
