import { App } from '@slack/bolt'
import { CommandHandlers } from '../commands'
import { CommandNames } from '../constants'
import { ScheduledJob } from './cron'
import Log from './logger'

export const initCommandHandler = (scheduledJobs: ScheduledJob[], slackAppInstance: App) => {
  Object.values(CommandNames).forEach((commandName) => {
    slackAppInstance.command(commandName, async (args) => {
      try {
        await CommandHandlers[commandName](args, scheduledJobs, slackAppInstance)
      } catch (error) {
        Log.error('Error in command handler', error)
      }
    })
  })
}
