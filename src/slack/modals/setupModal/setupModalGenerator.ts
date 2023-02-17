import { ModalView, PlainTextOption } from '@slack/web-api'
import { CronType, CronTypes } from 'constants/common'
import { ActionIds, BlockIds, ModalIds } from 'constants/slack'
import { MemberCronBlocks, TextCronBlocks } from './blocks'

const CronTypeOptions: PlainTextOption[] = [
  {
    text: {
      type: 'plain_text',
      text: 'Pick random members',
    },
    value: CronTypes.member,
  },
  {
    text: {
      type: 'plain_text',
      text: 'Pick random text',
    },
    value: CronTypes.text,
  },
]

export const generateSetupModal = ({
  metadata,
  cronType = CronTypes.member,
}: {
  metadata: {
    channelId: string
  }
  cronType?: CronType
}): ModalView => ({
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
      block_id: BlockIds.setupModal.cronType,
      dispatch_action: true,
      element: {
        action_id: ActionIds.setupModal.cronType,
        type: 'static_select',
        placeholder: {
          type: 'plain_text',
          text: 'Select an item',
        },
        initial_option: CronTypeOptions[0],
        options: CronTypeOptions,
      },
      label: {
        type: 'plain_text',
        text: 'Type',
      },
    },
    {
      type: 'input',
      block_id: BlockIds.setupModal.cron,
      element: {
        type: 'plain_text_input',
        action_id: ActionIds.setupModal.cron,
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
      type: 'input',
      block_id: BlockIds.setupModal.message,
      element: {
        type: 'plain_text_input',
        action_id: ActionIds.setupModal.message,
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
    ...(cronType === CronTypes.member ? MemberCronBlocks : []),
    ...(cronType === CronTypes.text ? TextCronBlocks : []),
  ],
  type: 'modal',
  private_metadata: JSON.stringify(metadata),
})
