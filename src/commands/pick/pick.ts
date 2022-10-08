import Command from '../../classes/Command'
import { CommandNames } from '../../constants'
import Log from '../../utils/logger'
import { picker } from '../../utils/picker'

const DEFAULT_MESSAGE = 'I choose you!'

export default new Command(
  {
    name: CommandNames.pick,
    description: 'Pick a random meeting moderator',
  },
  async ({ ack, command: { channel_id }, respond }, slackAppInstance) => {
    await ack()
    await respond('Aye aye captain! Wait, I am the captain...')
    await picker({ channelId: channel_id, message: DEFAULT_MESSAGE }, slackAppInstance).catch(
      async (error) => {
        await respond('Sorry. There was some kind of arr-or. :pirate_flag:')
        Log.error(error)
      }
    )
  }
)
