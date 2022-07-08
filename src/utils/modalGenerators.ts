import { ModalView } from '@slack/web-api'
import { BlockIds, ModalIds } from '../constants'

export const getSetupModal = (metadata: { channelId: string }): ModalView => ({
  callback_id: ModalIds.setup,
  title: {
    type: 'plain_text',
    text: 'Setup',
  },
  submit: {
    type: 'plain_text',
    text: 'Submit',
  },
  blocks: [
    {
      type: 'input',
      block_id: BlockIds.setup.cron,
      element: {
        type: 'plain_text_input',
        action_id: BlockIds.setup.cron,
        placeholder: {
          type: 'plain_text',
          text: 'Cron string',
        },
      },
      label: {
        type: 'plain_text',
        text: 'Cron',
      },
    },
    {
      type: 'input',
      block_id: BlockIds.setup.message,
      element: {
        type: 'plain_text_input',
        action_id: BlockIds.setup.message,
        placeholder: {
          type: 'plain_text',
          text: 'Stadup moderators',
        },
      },
      label: {
        type: 'plain_text',
        text: 'Message',
      },
    },
  ],
  type: 'modal',
  private_metadata: JSON.stringify(metadata),
})
