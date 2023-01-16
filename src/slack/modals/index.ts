import { App } from '@slack/bolt'
import { setupModalFieldsListener, setupModalSubmitListener } from './setupModal'

export const initModalListeners = (slackAppInstance: App) => {
  setupModalSubmitListener(slackAppInstance)
  setupModalFieldsListener(slackAppInstance)
}
