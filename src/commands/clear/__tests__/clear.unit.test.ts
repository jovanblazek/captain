import { App } from '@slack/bolt'
import ScheduledJobs from 'classes/ScheduledJobs'
import { mockSlackCommandMiddleware } from 'commands/__tests__/commandMiddleware'
import { PrismaMock } from 'utils/prismaClientMock'
import ClearCommand from '../clear'

describe('Clear command', () => {
  const slackAppInstance = {} as App
  const scheduledJobsSpy = jest
    .spyOn(ScheduledJobs.getInstance(), 'removeChannelJobs')
    .mockImplementation(() => null)

  const channelId = 'channelId'
  const mockedSlackCommandMiddleware = mockSlackCommandMiddleware({
    channelId,
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should remove scheduled jobs in channel', async () => {
    PrismaMock.cron.deleteMany.mockResolvedValue({ count: 1 })
    await ClearCommand.handler(mockedSlackCommandMiddleware, slackAppInstance)
    expect(mockedSlackCommandMiddleware.ack).toHaveBeenCalled()
    expect(scheduledJobsSpy).toHaveBeenCalledTimes(1)
    expect(scheduledJobsSpy).toHaveBeenCalledWith(channelId)
    expect(mockedSlackCommandMiddleware.respond).toHaveBeenCalledWith(
      'All jobs for this channel have been thrown overboard 🌊 🌊 🌊'
    )
  })

  it('should not remove scheduled jobs in channel if there are none', async () => {
    PrismaMock.cron.deleteMany.mockResolvedValue({ count: 0 })
    await ClearCommand.handler(mockedSlackCommandMiddleware, slackAppInstance)
    expect(mockedSlackCommandMiddleware.ack).toHaveBeenCalled()
    expect(scheduledJobsSpy).not.toHaveBeenCalled()
    expect(mockedSlackCommandMiddleware.respond).toHaveBeenCalledWith(
      "No jobs found on the deck. It's a good day to be a captain! 🏝"
    )
  })
})
