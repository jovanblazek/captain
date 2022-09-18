import { App } from '@slack/bolt'
import * as cron from '../cron'
import { PrismaMock } from '../prismaClientMock'

describe('cron', () => {
  describe('initCronJobs', () => {
    const scheduleCronJobSpy = jest.spyOn(cron, 'scheduleCronJob').mockImplementation(() => null)

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should load cron jobs from database', async () => {
      const cronJob = {
        id: 1,
        channelId: 'C1234567890',
        schedule: '0 0 * * *',
        ignoredMembers: '["U1234567890"]',
        message: 'Hello World',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      PrismaMock.cron.findMany.mockResolvedValue([cronJob])
      const app = {} as App
      await cron.initCronJobs(app)
      expect(scheduleCronJobSpy).toHaveBeenCalledTimes(1)
      expect(scheduleCronJobSpy).toHaveBeenCalledWith(
        cronJob.schedule,
        {
          channelId: cronJob.channelId,
          ignoredMembers: JSON.parse(cronJob.ignoredMembers),
          message: cronJob.message,
        },
        app
      )
    })

    it('should not load cron jobs from database if there are none', async () => {
      PrismaMock.cron.findMany.mockResolvedValue([])
      await cron.initCronJobs({} as App)
      expect(scheduleCronJobSpy).toHaveBeenCalledTimes(0)
    })
  })
})
