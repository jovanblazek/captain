import { Command } from '../../classes'
import { CommandNames } from '../../constants'
import { ClearCommand } from '../clear'
import { ListCommand } from '../list'
import { PickCommand } from '../pick'
import SetupCommand from '../setup'

const HelpCommand = new Command(
  {
    name: CommandNames.help,
    description: 'Stop it! Get some help',
  },
  async ({ ack, respond }) => {
    await ack()
    await respond(
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      Object.values(Commands)
        .map(({ params: { name, description } }) => `\`${name}\` ${description}`)
        .join('\n')
    )
  }
)

// Commands need to be exported from here due to circular dependency in HelpCommand
export const Commands = {
  ClearCommand,
  ListCommand,
  SetupCommand,
  PickCommand,
  HelpCommand,
}
