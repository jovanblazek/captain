import { ModalView } from '@slack/web-api'
import { ActionIds, BlockIds } from 'constants/slack'

export const TextCronBlocks: ModalView['blocks'] = [
  {
    type: 'input',
    block_id: BlockIds.setupModal.textCron.sourceText,
    label: {
      type: 'plain_text',
      text: 'Options (one per line)',
    },
    element: {
      type: 'plain_text_input',
      action_id: ActionIds.setupModal.textCron.sourceText,
      multiline: true,
      placeholder: {
        type: 'plain_text',
        text: 'Option 1\nOption 2\nOption 3',
      },
    },
  },
]
