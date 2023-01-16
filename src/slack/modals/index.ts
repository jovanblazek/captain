import { App } from '@slack/bolt'
import { setupModalSubmitListener } from './setupModal'

export const initModalSubmitListeners = (slackAppInstance: App) => {
  setupModalSubmitListener(slackAppInstance)
}
