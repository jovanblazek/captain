import { SlackViewAction } from '@slack/bolt'
import ValidationError from 'classes/ValidationError'
import { getModalData, TextCronSetupValidationSchema } from './validation'

// eslint-disable-next-line require-await, @typescript-eslint/require-await
export const textCronSetup = async (modalBody: SlackViewAction) => {
  const userInput = getModalData(modalBody)
  const validationResult = TextCronSetupValidationSchema.safeParse(userInput)

  if (!validationResult.success) {
    throw new ValidationError(validationResult.error.flatten())
  }

  // const { cronId, userId, channelId, schedule, message, sourceText } = validationResult.data
}
