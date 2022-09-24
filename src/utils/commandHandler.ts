import { App } from '@slack/bolt'
import { reduce } from 'lodash'
import { CommandHandlerArgs } from '../classes'
import { Commands } from '../commands'
import { CommandNames } from '../constants'
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
