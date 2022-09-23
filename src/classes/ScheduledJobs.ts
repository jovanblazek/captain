import cron from 'node-cron'

export type ScheduledJob = {
  channelId: string
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

  /**
   * @method `reset()` is used only to reset the instance between test cases
   */
  static reset() {
    this.instance = new ScheduledJobs()
  }

  private scheduledJobs: ScheduledJob[] = []

  addJob(job: ScheduledJob) {
    this.scheduledJobs = [...this.scheduledJobs, job]
  }

  getJobs() {
    return this.scheduledJobs
  }

  removeChannelJobs(channelId: string) {
    this.scheduledJobs = this.scheduledJobs.reduce((acc, job) => {
      if (job.channelId === channelId) {
        job.cron.stop()
        return acc
      }
      return [...acc, job]
    }, [] as ScheduledJob[])
  }
}
