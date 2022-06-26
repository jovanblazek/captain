import { Command } from '../classes'
import { CommandNames } from '../constants'
import { randomPicker } from '../utils/randomPicker'

export default new Command(
  {
    name: CommandNames.pick,
    description: 'Pick a random meeting moderator',
  },
  async ({ ack, command, respond }, _, slackAppInstance) => {
    await ack()
    await respond('Aye aye captain! Wait, I am the captain...')
    await randomPicker(command.channel_id, slackAppInstance)
  }
)
