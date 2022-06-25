// eslint-disable-next-line simple-import-sort/imports
import '../config/environment'
import { App as SlackApp } from '@slack/bolt'
import cron from 'node-cron'
import Log from './utils/logger'
import { randomPicker } from './randomPicker'

const { PORT, SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, SLACK_APP_TOKEN } = process.env

const CronJobs = [
  {
    channelName: 'general',
    schedule: '*/2 * * * *',
  },
]

export const SlackAppInstance = new SlackApp({
  token: SLACK_BOT_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: SLACK_APP_TOKEN,
  port: Number(PORT) || 4000,
})

// void randomPicker('general', SlackAppInstance)

void (async () => {
  await SlackAppInstance.start()
  Log.info(`Slack bot server is running. API is listening on port ${PORT || ''}`)
})()

CronJobs.forEach(({ channelName, schedule }) => {
  cron.schedule(
    schedule,
    () => {
      Log.info(`Running cron job for channel ${channelName}`)
      void randomPicker(channelName, SlackAppInstance)
    },
    {
      scheduled: true,
      timezone: 'Europe/Berlin',
    }
  )
})
