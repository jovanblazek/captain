import { App } from '@slack/bolt'
import { WebClient } from '@slack/web-api'
import { times } from 'lodash'
import { picker } from '../picker'

const ChannelMembers = times(3, String)
const MESSAGE = 'Hello world!'
const CHANNEL_ID = '1234'

jest.mock('@slack/web-api', () => ({
  WebClient: jest.fn(() => ({
    chat: {
      postMessage: jest.fn(),
    },
    conversations: {
      members: jest.fn(() => ({ members: ChannelMembers })),
    },
    users: {
      info: jest.fn(({ user }) => ({
        user: { is_bot: false, id: user },
      })),
    },
  })),
}))

describe('picker', () => {
  const slackAppInstance = {} as App

  beforeAll(() => {
    slackAppInstance.client = new WebClient()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should generate moderators and call message API', async () => {
    await picker(
      { channelId: CHANNEL_ID, message: MESSAGE, ignoredMembers: [ChannelMembers[0]] },
      slackAppInstance
    )
    expect(slackAppInstance.client.chat.postMessage).toHaveBeenCalledTimes(1)
    expect(slackAppInstance.client.chat.postMessage).toHaveBeenCalledWith({
      channel: CHANNEL_ID,
      text: expect.any(String),
      link_names: true,
    })
  })

  it('should throw error if no moderators generated', async () => {
    jest
      .spyOn(slackAppInstance.client.conversations, 'members')
      .mockResolvedValue({ members: [] as string[], ok: true })
    await expect(
      picker({ channelId: CHANNEL_ID, message: MESSAGE, ignoredMembers: [] }, slackAppInstance)
    ).rejects.toThrow()
    expect(slackAppInstance.client.chat.postMessage).toHaveBeenCalledTimes(0)
  })
})
