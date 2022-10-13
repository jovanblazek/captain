import { App, SlackCommandMiddlewareArgs } from '@slack/bolt'

export type CommandParametersArgs = {
  name: string
  description: string
}

export type CommandHandlerArgs = (
  args: SlackCommandMiddlewareArgs,
  slackAppInstance: App
) => Promise<void>

export default class Command {
  params: CommandParametersArgs
  handler: CommandHandlerArgs

  constructor(params: CommandParametersArgs, handler: CommandHandlerArgs) {
    this.params = params
    this.handler = handler
  }
}
