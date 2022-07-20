import { App } from '@slack/bolt'
import { WebClient } from '@slack/web-api'
import dayjs from 'dayjs'
import MockDate from 'mockdate'
import { getMedal, replaceDate, sendMessage } from '../messages'

jest.mock('@slack/web-api', () => ({
  WebClient: jest.fn(() => ({
    chat: {
      postMessage: jest.fn(),
      postEphemeral: jest.fn(),
    },
  })),
}))

describe('Messages utils', () => {
  describe('sendMessage', () => {
    const slackAppInstance = {} as App

    beforeAll(() => {
      slackAppInstance.client = new WebClient()
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    const channelId = '1234'
    const text = 'Hello world!'

    it('should call postMessage API', async () => {
      await sendMessage({ channelId, text }, slackAppInstance)
      expect(slackAppInstance.client.chat.postMessage).toHaveBeenCalledTimes(1)
      expect(slackAppInstance.client.chat.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          channel: channelId,
          text,
          link_names: true,
        })
      )
    })

    it('should call postEphemeral API', async () => {
      const userId = '5678'
      await sendMessage({ channelId, userId, text }, slackAppInstance)
      expect(slackAppInstance.client.chat.postEphemeral).toHaveBeenCalledTimes(1)
      expect(slackAppInstance.client.chat.postEphemeral).toHaveBeenCalledWith(
        expect.objectContaining({
          channel: channelId,
          text,
          user: userId,
          link_names: true,
        })
      )
    })
  })

  describe('getMedal', () => {
    it('should return the correct medal', () => {
      expect(getMedal(1)).toBe('🥇')
      expect(getMedal(2)).toBe('🥈')
      expect(getMedal(3)).toBe('🥉')
      expect(getMedal(4)).toBe('4. ')
    })
  })

  describe('replaceDate', () => {
    MockDate.set('2022-01-01')
    it('should replace {{date}} with the current date', () => {
      const date = dayjs().format('DD.MM.')
      expect(replaceDate('Hello {{date}}')).toBe(`Hello ${date}`)
      expect(replaceDate('Hello {{date}} there')).toBe(`Hello ${date} there`)
      expect(replaceDate('Hello {{date}} {{date}}')).toBe(`Hello ${date} ${date}`)
      expect(replaceDate('Hello{{date}}there')).toBe(`Hello${date}there`)
      expect(replaceDate('{{date}}')).toBe(date)
    })

    it('should not replace {{date}} if it is not present', () => {
      expect(replaceDate('Hello')).toBe('Hello')
      expect(replaceDate('')).toBe('')
    })
  })
})
