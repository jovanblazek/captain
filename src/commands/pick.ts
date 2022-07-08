import { Command } from '../classes'
import { CommandNames } from '../constants'
import Log from '../utils/logger'
import { randomPicker } from '../utils/randomPicker'

export default new Command(
  {
    name: CommandNames.pick,
    description: 'Pick a random meeting moderator',
  },
  async ({ ack, command: { channel_id }, respond }, slackAppInstance) => {
    await ack()
    await respond('Aye aye captain! Wait, I am the captain...')
    await randomPicker({ channelId: channel_id, slackAppInstance }).catch(async (error) => {
      await respond('Sorry. There was some kind of arr-or. :pirate_flag:')
      Log.error(error)
    })
  }
)
