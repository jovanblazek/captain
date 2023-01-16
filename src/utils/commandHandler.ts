import { App } from '@slack/bolt'
import { CommandHandlerArgs } from 'classes/Command'
import { reduce } from 'lodash'
import { CommandNames } from 'constants/slack'
import { Commands } from '../commands'
import Log from './logger'

const CommandHandlers: { [key: string]: CommandHandlerArgs } = reduce(
  Commands,
  (commandHandlers, command) => ({
    ...commandHandlers,
    [command.params.name]: command.handler,
  }),
  {}
)

export const initCommandHandler = (slackAppInstance: App) => {
  Object.values(CommandNames).forEach((commandName) => {
    slackAppInstance.command(commandName, async (args) => {
      try {
        if (CommandHandlers[commandName]) {
          await CommandHandlers[commandName](args, slackAppInstance)
          return
        }
      } catch (error) {
        Log.error('Error in command handler', error)
      }
    })
  })
}
