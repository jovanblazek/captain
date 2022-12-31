import { App } from '@slack/bolt'
import { addToChannelButtonListener } from './addToChannel'

export const initEventListeners = (slackAppInstance: App) => {
  addToChannelButtonListener(slackAppInstance)
}
