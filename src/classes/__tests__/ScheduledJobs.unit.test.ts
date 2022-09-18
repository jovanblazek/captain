import ScheduledJobs, { ScheduledJob } from '../ScheduledJobs'

describe('ScheduledJobs', () => {
  beforeEach(() => {
    ScheduledJobs.reset()
  })

  it('should act like singleton and have just one instance', () => {
    const firstInstance = ScheduledJobs.getInstance()
    firstInstance.addJob({ channelId: '1' } as ScheduledJob)
    const secondInstance = ScheduledJobs.getInstance()

    expect(firstInstance).toBeInstanceOf(ScheduledJobs)
    expect(secondInstance).toBeInstanceOf(ScheduledJobs)
    expect(firstInstance).toStrictEqual(secondInstance)
    expect(firstInstance.getJobs()).toStrictEqual(secondInstance.getJobs())
  })

  it('addJob should add job to the end of the array', () => {
    const jobs = [
      {
        channelId: '1',
      },
      {
        channelId: '2',
      },
    ] as ScheduledJob[]
    const scheduledJobs = ScheduledJobs.getInstance()
    scheduledJobs.addJob(jobs[0])
    expect(scheduledJobs.getJobs()).toStrictEqual([jobs[0]])
    scheduledJobs.addJob(jobs[1])
    expect(scheduledJobs.getJobs()).toStrictEqual(jobs)
  })

  it('removeChannelJobs should stop & remove cron jobs from memory', () => {
    const jobs = [
      {
        channelId: '1',
        cron: {
          stop: jest.fn(),
        },
      },
      {
        channelId: '2',
        cron: {
          stop: jest.fn(),
        },
      },
      {
        channelId: '1',
        cron: {
          stop: jest.fn(),
        },
      },
    ] as unknown as ScheduledJob[]
    const scheduledJobs = ScheduledJobs.getInstance()
    jobs.forEach((job) => {
      scheduledJobs.addJob(job)
    })

    scheduledJobs.removeChannelJobs('1')
    expect(jobs[0].cron.stop).toHaveBeenCalledTimes(1)
    expect(jobs[2].cron.stop).toHaveBeenCalledTimes(1)
    expect(scheduledJobs.getJobs()).toStrictEqual([jobs[1]])
  })
})
