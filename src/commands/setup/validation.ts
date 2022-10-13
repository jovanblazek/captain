import { SlackViewAction } from '@slack/bolt'
import { get, reduce } from 'lodash'
import { validate } from 'node-cron'
import { typeToFlattenedError, z } from 'zod'
import { parseJson } from 'utils/formatters'
import { BlockIds } from '../../constants'

export type UserInputType = z.infer<typeof SetupModalValidationSchema>

const SetupModalValidationSchema = z.object({
  channelId: z.string().min(1, "Channel ID can't be empty"),
  userId: z.string().min(1, "User ID can't be empty"),
  schedule: z.string().refine((value) => validate(value), {
    message: 'Cron syntax error. Validate syntax at this <https://crontab.guru/|this site>.',
  }),
  message: z.string().trim().min(1, "Message can't be empty"),
  ignoredMembers: z.array(z.string({ invalid_type_error: 'Invalid ID in ignored members' })),
})

export const validateSetupModalInput = (userInput: UserInputType) => {
  const result = SetupModalValidationSchema.safeParse(userInput)
  if (!result.success) {
    return {
      ...result,
      error: result.error.flatten(),
    }
  }
  return result
}

export const getModalData = (body: SlackViewAction): UserInputType => {
  const values = get(body, ['view', 'state', 'values'])
  const { channelId } = parseJson<{ channelId: string }>(get(body, ['view', 'private_metadata']))!
  return {
    channelId,
    userId: get(body, ['user', 'id']),
    schedule: get(values, [BlockIds.setup.cron, BlockIds.setup.cron, 'value'])!,
    message: get(values, [BlockIds.setup.message, BlockIds.setup.message, 'value'])!,
    ignoredMembers: get(
      values,
      [BlockIds.setup.ignoredMembers, BlockIds.setup.ignoredMembers, 'selected_users'],
      []
    ),
  }
}

export const generateErrorMessage = (errors: typeToFlattenedError<UserInputType>) =>
  reduce(
    errors.fieldErrors,
    (acc, error) => {
      if (error) {
        return [...acc, error.join('\n')]
      }
      return acc
    },
    [] as string[]
  ).join('\n')
