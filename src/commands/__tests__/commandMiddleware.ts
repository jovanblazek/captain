import { SlackCommandMiddlewareArgs } from '@slack/bolt'

export const mockSlackCommandMiddleware = (
  { channelId }: { channelId: string },
  overrides?: Partial<SlackCommandMiddlewareArgs>
): SlackCommandMiddlewareArgs => ({
  command: {
    channel_id: channelId,
  } as SlackCommandMiddlewareArgs['command'],
  body: {} as SlackCommandMiddlewareArgs['body'],
  payload: {} as SlackCommandMiddlewareArgs['payload'],
  ack: jest.fn(),
  respond: jest.fn(),
  say: jest.fn(),
  ...overrides,
})
