import { App } from '@slack/bolt'
import { reduce } from 'lodash'
import { CommandHandlerArgs } from '../classes'
import { Commands } from '../commands'
import helpCommand from '../commands/help'
import { CommandNames } from '../constants'
import { ScheduledJob } from './cron'
import Log from './logger'

const CommandHandlers: { [key: string]: CommandHandlerArgs } = reduce(
  Commands,
  (commandHandlers, command) => ({
    ...commandHandlers,
    [command.params.name]: command.handler,
  }),
  {}
)

export const initCommandHandler = (scheduledJobs: ScheduledJob[], slackAppInstance: App) => {
  Object.values(CommandNames).forEach((commandName) => {
    slackAppInstance.command(commandName, async (args) => {
      try {
        if (CommandHandlers[commandName]) {
          await CommandHandlers[commandName](args, scheduledJobs, slackAppInstance)
          return
        }

        if (commandName === CommandNames.help) {
          await helpCommand.handler(args, scheduledJobs, slackAppInstance)
        }
      } catch (error) {
        Log.error('Error in command handler', error)
      }
    })
  })
}
