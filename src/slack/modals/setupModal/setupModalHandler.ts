import { App } from '@slack/bolt'
import { handleSetupModalSubmit } from 'commands/setup'
import { ModalIds } from 'constants/slack'

export const setupModalSubmitListener = (slackAppInstance: App) => {
  slackAppInstance.view(ModalIds.setup, async (args) => {
    await handleSetupModalSubmit(args, slackAppInstance)
  })
}
