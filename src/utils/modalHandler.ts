import { App } from '@slack/bolt'
import { handleSetupModalSubmit } from '../commands/setup'
import { ModalIds } from '../constants'

export const initModalHandler = (slackAppInstance: App) => {
  slackAppInstance.view(ModalIds.setup, async (args) => {
    await handleSetupModalSubmit(args, slackAppInstance)
  })
}
