import { SlackViewAction } from '@slack/bolt'
import { get } from 'lodash'
import { typeToFlattenedError } from 'zod'
import { BlockIds } from '../../../constants'
import {
  generateErrorMessage,
  getModalData,
  UserInputType,
  validateSetupModalInput,
} from '../validationSchema'

const mockUserInput = (overrides?: Partial<UserInputType>) => ({
  channelId: 'channelId',
  userId: 'userId',
  schedule: '* * * * *',
  message: 'message',
  ignoredMembers: ['ignoredMemberId1', 'ignoredMemberId2', 'ignoredMemberId3'],
  ...(overrides || {}),
})

describe('setup validationSchema', () => {
  describe('validateSetupModalInput', () => {
    it('should run validation', () => {
      const input = mockUserInput()
      const validationResult = validateSetupModalInput(input)
      expect(validationResult.success).toEqual(true)
      expect(get(validationResult, 'data')).toStrictEqual(input)
    })

    it('should trim message', () => {
      const input = mockUserInput({ message: '  message  ' })
      const validationResult = validateSetupModalInput(input)
      expect(validationResult.success).toEqual(true)
      expect(get(validationResult, 'data')).not.toStrictEqual(input)
      expect(get(validationResult, 'data.message')).toEqual('message')
    })

    it('should fail if schedule is invalid', () => {
      const input = mockUserInput({ schedule: 'invalid' })
      const validationResult = validateSetupModalInput(input)
      expect(validationResult.success).toEqual(false)
      expect(get(validationResult, ['error'])).toStrictEqual(
        expect.objectContaining({
          fieldErrors: {
            schedule: [
              'Cron syntax error. Validate syntax at this <https://crontab.guru/|this site>.',
            ],
          },
        })
      )
    })
  })

  describe('generateErrorMessage', () => {
    it('should generate error message for every field', () => {
      const input = mockUserInput({
        channelId: '',
        userId: '',
        schedule: 'invalid',
        message: '',
        ignoredMembers: [1, 2, 3] as unknown as string[],
      })
      const validationResult = validateSetupModalInput(input)
      const errorMessage = generateErrorMessage(
        get(validationResult, ['error']) as typeToFlattenedError<UserInputType>
      )
      expect(errorMessage).toMatchSnapshot()
    })

    it('should return empty string if there are no errors', () => {
      const errorMessage = generateErrorMessage({ formErrors: [], fieldErrors: {} })
      expect(errorMessage).toEqual('')
    })
  })

  describe('getModalData', () => {
    it('should return parsed data', () => {
      const body = {
        user: {
          id: 'userId',
        },
        view: {
          private_metadata: '{"channelId": "channelId"}',
          state: {
            values: {
              [BlockIds.setup.cron]: {
                [BlockIds.setup.cron]: {
                  value: '* * * * *',
                },
              },
              [BlockIds.setup.message]: {
                [BlockIds.setup.message]: {
                  value: 'message',
                },
              },
              [BlockIds.setup.ignoredMembers]: {
                [BlockIds.setup.ignoredMembers]: {
                  selected_users: ['ignoredMemberId1', 'ignoredMemberId2', 'ignoredMemberId3'],
                },
              },
            },
          },
        },
      }
      const result = getModalData(body as SlackViewAction)
      expect(result).toStrictEqual(mockUserInput())
    })
  })
})
