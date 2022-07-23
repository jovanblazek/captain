import { ModalView } from '@slack/web-api'
import { BlockIds, ModalIds } from '../../constants'

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
          text: '* * * * *',
        },
      },
      label: {
        type: 'plain_text',
        text: 'Cron string',
      },
    },
    {
      type: 'section',
      block_id: BlockIds.setup.ignoredMembers,
      text: {
        type: 'mrkdwn',
        text: '*Ignored users* (bots are ignored automatically)',
      },
      accessory: {
        action_id: BlockIds.setup.ignoredMembers,
        type: 'multi_users_select',
        placeholder: {
          type: 'plain_text',
          text: 'Select users to ignore when picking',
        },
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
          text: "It's {{date}} and todays standup moderators are:",
        },
      },
      label: {
        type: 'plain_text',
        text: 'Message',
      },
    },
    {
      type: 'input',
      block_id: BlockIds.setup.isLastPickExcluded,
      optional: true,
      element: {
        type: 'checkboxes',
        action_id: BlockIds.setup.isLastPickExcluded,
        options: [
          {
            text: {
              type: 'plain_text',
              text: 'Exclude n.1 pick from following draw',
            },
            value: 'true',
          },
        ],
      },
      label: {
        type: 'plain_text',
        text: 'Options:',
      },
    },
  ],
  type: 'modal',
  private_metadata: JSON.stringify(metadata),
})
