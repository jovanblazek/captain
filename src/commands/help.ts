import { Command } from '../classes'
import { CommandNames } from '../constants'
import { Commands } from './index'

// TODO improve this to remove circular dependency with commands/index.ts
export default new Command(
  {
    name: CommandNames.help,
    description: 'Stop it! Get some help',
  },
  async ({ ack, respond }) => {
    await ack()
    await respond(
      Object.values(Commands)
        .map(({ params: { name, description } }) => `\`${name}\` ${description}`)
        .join('\n')
    )
  }
)
