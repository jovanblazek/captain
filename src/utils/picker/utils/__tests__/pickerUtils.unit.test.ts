import { App } from '@slack/bolt'
import { WebClient } from '@slack/web-api'
import { mockSlackApi } from '../../../mocks'
import { getChannelMembersIds } from '../channelMembers'
import { filterIgnoredMembers } from '../filterIgnoredMembers'
import { getRandomArrayElements } from '../getRandomArrayElements'

const ChannelMembers = ['member1', 'member2', 'member3']

mockSlackApi({
  conversations: {
    members: jest.fn(),
  },
  users: {
    info: jest.fn(),
  },
})

describe('picker utils', () => {
  const slackAppInstance = {} as App

  beforeAll(() => {
    slackAppInstance.client = new WebClient()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('channelMembers', () => {
    const channelId = '1234'
    let conversationMembersSpy: jest.SpyInstance
    beforeAll(() => {
      conversationMembersSpy = jest.spyOn(slackAppInstance.client.conversations, 'members')
      conversationMembersSpy.mockImplementation(() => ({ members: ChannelMembers }))
    })
    beforeEach(() => {
      jest.clearAllMocks()
    })
    it('should call slack API and return members', async () => {
      const result = await getChannelMembersIds(channelId, slackAppInstance)
      expect(conversationMembersSpy).toHaveBeenCalledTimes(1)
      expect(conversationMembersSpy).toHaveBeenCalledWith({
        channel: channelId,
        limit: expect.any(Number),
      })
      expect(result).toStrictEqual(ChannelMembers)
    })

    it('should throw error if no members found', async () => {
      conversationMembersSpy.mockImplementationOnce(() => ({ members: null }))
      await expect(getChannelMembersIds(channelId, slackAppInstance)).rejects.toThrow()
      expect(conversationMembersSpy).toHaveBeenCalledTimes(1)
      expect(conversationMembersSpy).toHaveBeenCalledWith({
        channel: channelId,
        limit: expect.any(Number),
      })
    })
  })

  describe.skip('filterBots', () => {
    let usersInfoSpy: jest.SpyInstance
    beforeAll(() => {
      usersInfoSpy = jest.spyOn(slackAppInstance.client.users, 'info')
      usersInfoSpy.mockImplementation(({ user }) => ({
        user: { is_bot: false, id: user },
      }))
    })
    beforeEach(() => {
      jest.clearAllMocks()
    })
    it('should filter out bot members', () => {})

    it('should throw error when no human members are found', () => {})
  })

  describe('filterIgnoredMembers', () => {
    const members = ['a', 'b', 'c']

    it.each([
      [members, ['b'], ['a', 'c']],
      [members, [], members],
    ])(
      'should retrun array without ignored members',
      (channelMembers, ignoredMembers, expected) => {
        const result = filterIgnoredMembers(channelMembers, ignoredMembers)
        expect(result).toStrictEqual(expected)
      }
    )

    it('should throw error if there are no members left', () => {
      expect(() => filterIgnoredMembers(members, members)).toThrow()
    })
  })

  describe('getRandomArrayElements', () => {
    it('should return defined number of elements', () => {
      const array = [1, 2, 3, 4]
      const requestedCount = 2
      const result = getRandomArrayElements(array, requestedCount)
      expect(result).toHaveLength(requestedCount)
    })

    it('should return all elements if requested count is greater than length', () => {
      const array = [1, 2]
      const requestedCount = 3
      const result = getRandomArrayElements(array, requestedCount)
      expect(result).toHaveLength(array.length)
    })
  })
})
