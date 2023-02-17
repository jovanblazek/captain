import { AllMiddlewareArgs, App, SlackViewAction, SlackViewMiddlewareArgs } from '@slack/bolt'
import Command from 'classes/Command'
import ValidationError from 'classes/ValidationError'
import { generateSetupModal } from 'slack/modals/setupModal'
import { CronTypes } from 'constants/common'
import { CommandNames } from 'constants/slack'
import Log from 'utils/logger'
import { sendMessage } from 'utils/messages'
import { memberCronSetup } from './memberCron/memberCronSetup'
import { textCronSetup } from './textCron/textCronSetup'
import { getSetupModalCronData } from './validation'

export const handleSetupModalSubmit = async (
  { ack, body }: SlackViewMiddlewareArgs<SlackViewAction> & AllMiddlewareArgs,
  slackAppInstance: App
) => {
  await ack()
  const { type, channelId, userId } = getSetupModalCronData(body)

  try {
    if (type === CronTypes.member) {
      Log.debug('Running member cron setup')
      await memberCronSetup(body, slackAppInstance)
    } else if (type === CronTypes.text) {
      Log.debug('Running text cron setup')
      await textCronSetup(body)
    }
  } catch (error) {
    if (channelId && userId) {
      await sendMessage(
        {
          channelId,
          userId,
          text: error instanceof ValidationError ? error.message : 'Something went wrong',
        },
        slackAppInstance
      )
      return
    }
    Log.error(error)
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
      view: generateSetupModal({ metadata: { channelId: payload.channel_id } }),
    })
  }
)
