import { App, InteractiveButtonClick } from '@slack/bolt'
import { ActionIds } from '../../constants'

export const addToChannelButtonListener = (slackAppInstance: App) => {
  slackAppInstance.action<InteractiveButtonClick>(
    ActionIds.addToChannelButton,
    async ({ ack, body, client, respond, action }) => {
      await ack()
      if (body?.channel?.id) {
        await client.conversations.join({
          channel: body.channel.id,
        })
        const additionalText = action?.value
        await respond({
          text: `Thanks! I have been added to the channel.${
            additionalText ? `\n${additionalText}` : ''
          }`,
        })
      }
    }
  )
}
