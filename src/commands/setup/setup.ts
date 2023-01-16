import { AllMiddlewareArgs, App, SlackViewAction, SlackViewMiddlewareArgs } from '@slack/bolt'
import Command from 'classes/Command'
import { generateSetupModal } from 'slack/modals/setupModal'
import { typeToFlattenedError } from 'zod'
import { sendMessage } from 'utils/messages'
import { CommandNames, CronTypes } from '../../constants'
import { memberCronSetup } from './memberCron/memberCronSetup'
import { generateErrorMessage, getSetupModalCronData } from './validation'

export const handleSetupModalSubmit = async (
  { ack, body }: SlackViewMiddlewareArgs<SlackViewAction> & AllMiddlewareArgs,
  slackAppInstance: App
) => {
  await ack()
  const { type, channelId, userId } = getSetupModalCronData(body)

  let validationResult: typeToFlattenedError<unknown> | null = null
  if (type === CronTypes.member) {
    validationResult = await memberCronSetup(body, slackAppInstance)
  } else if (type === CronTypes.text) {
    // TODO
  }

  if (validationResult && channelId && userId) {
    await sendMessage(
      {
        channelId,
        userId,
        text: `⚠️ There was an error with your input:\n${generateErrorMessage(validationResult)}`,
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
      view: generateSetupModal({ channelId: payload.channel_id }),
    })
  }
)
