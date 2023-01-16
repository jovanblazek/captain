import { SlackViewAction } from '@slack/bolt'
import { get } from 'lodash'
import { z } from 'zod'
import { BlockIds } from 'constants/slack'
import { CronBaseFieldValidationSchema, getSetupModalCronData } from '../validation'

export type MemberCronSetupUserInput = z.infer<typeof MemberCronSetupValidationSchema>

export const MemberCronSetupValidationSchema = z.object({
  ...CronBaseFieldValidationSchema,
  ignoredMembers: z.array(z.string({ invalid_type_error: 'Invalid ID in ignored members' })),
})

export const getModalData = (body: SlackViewAction): MemberCronSetupUserInput => {
  const values = get(body, ['view', 'state', 'values'])
  return {
    ...getSetupModalCronData(body),
    ignoredMembers: get(
      values,
      [BlockIds.setup.ignoredMembers, BlockIds.setup.ignoredMembers, 'selected_users'],
      []
    ),
  }
}
