import { SlackViewAction } from '@slack/bolt'
import { get, reduce } from 'lodash'
import { validate } from 'node-cron'
import { typeToFlattenedError, z } from 'zod'
import { parseJson } from 'utils/formatters'
import { BlockIds } from '../../constants'

export const CronBaseFieldValidationSchema = {
  cronId: z.number().optional(),
  type: z.string(),
  channelId: z.string().min(1, "Channel ID can't be empty"),
  userId: z.string().min(1, "User ID can't be empty"),
  schedule: z.string().refine((value) => validate(value), {
    message: 'Cron syntax error. Validate syntax at this <https://crontab.guru/|this site>.',
  }),
  message: z.string().trim().min(1, "Message can't be empty"),
}

const BaseSchema = z.object(CronBaseFieldValidationSchema)
// Gets the data for shared fields between all cron types
export const getSetupModalCronData = (body: SlackViewAction): z.infer<typeof BaseSchema> => {
  const values = get(body, ['view', 'state', 'values'])
  const { cronId, channelId } = parseJson<{ cronId: number | undefined; channelId: string }>(
    get(body, ['view', 'private_metadata'])
  )!
  return {
    cronId,
    type: 'member', // TODO add select for this
    channelId,
    userId: get(body, ['user', 'id']),
    schedule: get(values, [BlockIds.setup.cron, BlockIds.setup.cron, 'value'])!,
    message: get(values, [BlockIds.setup.message, BlockIds.setup.message, 'value'])!,
  }
}

export const generateErrorMessage = <T>(errors: typeToFlattenedError<T>) =>
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
