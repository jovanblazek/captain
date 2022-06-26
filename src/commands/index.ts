import { reduce } from 'lodash'
import { CommandHandlerArgs } from '../classes'
import clear from './clear'
import list from './list'
import setup from './setup'

export const Commands = {
  clear,
  list,
  setup,
}

export const CommandHandlers: { [key: string]: CommandHandlerArgs } = reduce(
  Commands,
  (commandHandlers, command) => ({
    ...commandHandlers,
    [command.params.name]: command.handler,
  }),
  {}
)
