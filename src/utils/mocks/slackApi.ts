export const mockSlackApi = (methods: Record<string, unknown>) =>
  jest.mock('@slack/web-api', () => {
    const mockedClient = {
      chat: {
        postMessage: jest.fn(),
        postEphemeral: jest.fn(),
      },
      ...methods,
    }
    return { WebClient: jest.fn(() => mockedClient) }
  })
