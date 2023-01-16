import { App, BlockStaticSelectAction } from '@slack/bolt'
import { handleSetupModalSubmit } from 'commands/setup'
import { get } from 'lodash'
import { CronType } from 'constants/common'
import { ActionIds, BlockIds, ModalIds } from 'constants/slack'
import { parseJson } from 'utils/formatters'
import { generateSetupModal } from './setupModalGenerator'

export const setupModalSubmitListener = (slackAppInstance: App) => {
  slackAppInstance.view(ModalIds.setup, async (args) => {
    await handleSetupModalSubmit(args, slackAppInstance)
  })
}

export const setupModalFieldsListener = (slackAppInstance: App) => {
  slackAppInstance.action<BlockStaticSelectAction>(
    BlockIds.setupModal.cronType,
    async ({ ack, body }) => {
      await ack()
      console.log('body', body)
      if (!body?.view) {
        return
      }
      // TODO: make some util function for getting data from view
      const cronType = get(body, [
        'view',
        'state',
        'values',
        BlockIds.setupModal.cronType,
        ActionIds.setupModal.cronType,
        'selected_option',
        'value',
      ]) as CronType | undefined
      if (!cronType) {
        return
      }

      const { view } = body
      await slackAppInstance.client.views.update({
        view_id: view.id,
        hash: view.hash,
        view: generateSetupModal({
          metadata: parseJson<{ channelId: string }>(view.private_metadata)!, // TODO update metadata passing
          cronType,
        }),
      })
    }
  )
}
