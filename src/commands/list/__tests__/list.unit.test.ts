import { Cron } from '@prisma/client'
import { App } from '@slack/bolt'
import { mockSlackCommandMiddleware } from 'commands/__tests__/commandMiddleware'
import { PrismaMock } from 'utils/prismaClientMock'
import ListCommand from '../list'

describe('List command', () => {
  const slackAppInstance = {} as App

  const channelId = 'channelId'
  const mockedSlackCommandMiddleware = mockSlackCommandMiddleware({
    channelId,
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should list scheduled jobs in channel', async () => {
    PrismaMock.cron.findMany.mockResolvedValue([
      {
        message: 'message1',
        schedule: '1 * * * *',
      },
      {
        message: 'message2',
        schedule: '2 * * * *',
      },
    ] as Cron[])

    await ListCommand.handler(mockedSlackCommandMiddleware, slackAppInstance)
    expect(mockedSlackCommandMiddleware.ack).toHaveBeenCalled()
    expect(mockedSlackCommandMiddleware.respond).toHaveBeenCalledWith(
      '1. `1 * * * *` - message1\n2. `2 * * * *` - message2'
    )
  })

  it('should not list scheduled jobs in channel if there are none', async () => {
    PrismaMock.cron.findMany.mockResolvedValue([])
    await ListCommand.handler(mockedSlackCommandMiddleware, slackAppInstance)
    expect(mockedSlackCommandMiddleware.ack).toHaveBeenCalled()
    expect(mockedSlackCommandMiddleware.respond).toHaveBeenCalledWith(
      'No scheduled jobs found. The map is definitely upside down 🗺 🤔'
    )
  })
})
