import { App } from '@slack/bolt'
import { WebClient } from '@slack/web-api'
import { getModerators, sendMessage } from '../helpers'

// jest.mock('@slack/bolt')
jest.mock('@slack/web-api', () => {
  const mockedClient = {
    chat: {
      postMessage: jest.fn(),
    },
    conversations: {
      members: jest.fn(),
    },
  }
  return { WebClient: jest.fn(() => mockedClient) }
})

describe('Helpers unit tests', () => {
  const slackAppInstance = {} as App

  beforeAll(() => {
    slackAppInstance.client = new WebClient()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('sendMessage', () => {
    it('should call postMessage', async () => {
      const channelId = '1234'
      const message = 'Hello world!'

      await sendMessage(channelId, message, slackAppInstance)

      expect(slackAppInstance.client.chat.postMessage).toHaveBeenCalledTimes(1)
      expect(slackAppInstance.client.chat.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          text: message,
          channel: channelId,
          link_names: true,
        })
      )
    })
  })

  describe('getModerators', () => {
    let conversationMembersSpy: jest.SpyInstance
    beforeAll(() => {
      conversationMembersSpy = jest.spyOn(slackAppInstance.client.conversations, 'members')
    })
    beforeEach(() => {
      jest.clearAllMocks()
    })
    it('should return null when no members are found in the channel', async () => {
      const channelId = '1234'

      conversationMembersSpy.mockImplementation(() => ({ members: null }))
      const moderators = await getModerators(channelId, slackAppInstance)

      expect(conversationMembersSpy).toHaveBeenCalledTimes(1)
      expect(conversationMembersSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          channel: channelId,
        })
      )
      expect(moderators).toBeNull()
    })

    it('should return array of moderators', async () => {
      const channelId = '1234'
      const members = ['member1', 'member2']

      conversationMembersSpy.mockImplementation(() => ({ members }))
      const moderators = await getModerators(channelId, slackAppInstance)

      expect(slackAppInstance.client.conversations.members).toHaveBeenCalledTimes(1)
      expect(slackAppInstance.client.conversations.members).toHaveBeenCalledWith(
        expect.objectContaining({
          channel: channelId,
        })
      )
      expect(moderators).toContainEqual('member1')
      expect(moderators).toContainEqual('member2')
    })
  })
})
