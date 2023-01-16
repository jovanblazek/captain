import { ModalView } from '@slack/web-api'
import { ActionIds, BlockIds } from 'constants/slack'

export const MemberCronBlocks: ModalView['blocks'] = [
  {
    type: 'section',
    block_id: BlockIds.setupModal.memberCron.ignoredMembers,
    text: {
      type: 'mrkdwn',
      text: 'Ignored users (bots are ignored automatically)',
    },
    accessory: {
      action_id: ActionIds.setupModal.memberCron.ignoredMembers,
      type: 'multi_users_select',
      placeholder: {
        type: 'plain_text',
        text: 'Select users to ignore when picking',
      },
    },
  },
]
