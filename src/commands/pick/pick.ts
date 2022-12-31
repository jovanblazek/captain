import Command from 'classes/Command'
import { get } from 'lodash'
import Log from 'utils/logger'
import { picker } from 'utils/picker'
import { ActionIds, CommandNames } from '../../constants'

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
        // TODO: Tidy this up
        const isNotInChannel = get(error, ['data', 'error']) === 'not_in_channel'
        await respond({
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `Sorry. There was some kind of arr-or. :pirate_flag:\n${
                  isNotInChannel
                    ? `It looks like I am not in this channel. Please add me to the channel and try running the \`${CommandNames.pick}\` command again.`
                    : ''
                }`,
              },
            },
            {
              type: 'actions',
              elements: [
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'Add me to this channel',
                    emoji: true,
                  },
                  action_id: ActionIds.addToChannelButton,
                  value: `You may now run the \`${CommandNames.pick}\` command again.`,
                },
              ],
            },
          ],
        })
        Log.error(error)
      }
    )
  }
)
