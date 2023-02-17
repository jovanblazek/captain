import { SlackViewAction } from '@slack/bolt'
import { get } from 'lodash'
import { z } from 'zod'
import { BlockIds } from 'constants/slack'
import { CronBaseFieldValidationSchema, getSetupModalCronData } from '../validation'

export type TextCronSetupUserInput = z.infer<typeof TextCronSetupValidationSchema>

export const TextCronSetupValidationSchema = z.object({
  ...CronBaseFieldValidationSchema,
  sourceText: z.string().min(1, "Source text can't be empty"),
})

export const getModalData = (body: SlackViewAction): TextCronSetupUserInput => {
  const values = get(body, ['view', 'state', 'values'])
  return {
    ...getSetupModalCronData(body),
    sourceText: get(values, [
      BlockIds.setupModal.textCron.sourceText,
      BlockIds.setupModal.textCron.sourceText,
      'value',
    ])!,
  }
}
