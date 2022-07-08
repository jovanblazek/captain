import cron from 'node-cron'

export type ScheduledJob = {
  channelId: string
  schedule: string
  cron: cron.ScheduledTask
}

export default class ScheduledJobs {
  private static instance: ScheduledJobs

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance() {
    if (!ScheduledJobs.instance) {
      ScheduledJobs.instance = new ScheduledJobs()
    }
    return ScheduledJobs.instance
  }

  private scheduledJobs: ScheduledJob[] = []

  addJob(job: ScheduledJob) {
    this.scheduledJobs.push(job)
  }

  getJobs() {
    return this.scheduledJobs
  }

  removeChannelJobs(channelId: string) {
    this.scheduledJobs
      .filter((job) => job.channelId === channelId)
      .forEach((job) => {
        job.cron.stop()
      })
    this.scheduledJobs = this.scheduledJobs.filter((job) => job.channelId !== channelId)
  }
}
