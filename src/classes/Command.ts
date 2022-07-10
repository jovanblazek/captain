import { App, SlackCommandMiddlewareArgs } from '@slack/bolt'

export type CommandParametersArgs = {
  name: string
  description: string
}

export type CommandHandlerArgs = (
  args: SlackCommandMiddlewareArgs,
  slackAppInstance: App
) => Promise<void>

export class Command {
  params: CommandParametersArgs
  handler: CommandHandlerArgs

  constructor(params: CommandParametersArgs, handler: CommandHandlerArgs) {
    this.params = params
    this.handler = handler
  }
}
