import { App as SlackApp, AppOptions } from '@slack/bolt'
import '../../config/environment'

const { PORT, SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, SLACK_APP_TOKEN } = process.env

const createSlackApp = (args?: AppOptions) =>
  new SlackApp({
    token: SLACK_BOT_TOKEN,
    signingSecret: SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: SLACK_APP_TOKEN,
    port: Number(PORT) || 4000,
    ...args,
  })

export default createSlackApp
