import { App } from '@slack/bolt'
import { WebClient } from '@slack/web-api'
import { times } from 'lodash'
import {
  filterBots,
  filterIgnoredMembers,
  getChannelMembersIds,
  getRandomArrayElements,
} from '../utils'

const ChannelMembers = times(3, String)

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
      await expect(getChannelMembersIds(channelId, slackAppInstance)).rejects.toThrow(
        'No channel members found while getting moderators'
      )
      expect(conversationMembersSpy).toHaveBeenCalledTimes(1)
      expect(conversationMembersSpy).toHaveBeenCalledWith({
        channel: channelId,
        limit: expect.any(Number),
      })
    })
  })

  describe('filterBots', () => {
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

    it('should return all members if they are not bots', async () => {
      const result = await filterBots(ChannelMembers, slackAppInstance)
      expect(usersInfoSpy).toHaveBeenCalledTimes(ChannelMembers.length)
      expect(result).toStrictEqual(ChannelMembers)
    })

    it('should filter out bot members', async () => {
      usersInfoSpy.mockImplementation(({ user }) => ({
        user: { is_bot: user === ChannelMembers[0], id: user },
      }))
      const result = await filterBots(ChannelMembers, slackAppInstance)
      expect(usersInfoSpy).toHaveBeenCalledTimes(ChannelMembers.length)
      expect(result).toStrictEqual(ChannelMembers.slice(1))
    })

    it('should throw error when no human members are found', async () => {
      usersInfoSpy.mockImplementation(({ user }) => ({
        user: { is_bot: true, id: user },
      }))
      await expect(filterBots(ChannelMembers, slackAppInstance)).rejects.toThrow(
        'No human channel members found while getting moderators'
      )
      expect(usersInfoSpy).toHaveBeenCalledTimes(ChannelMembers.length)
    })
  })

  describe('filterIgnoredMembers', () => {
    it.each([
      [ChannelMembers, [ChannelMembers[0]], ChannelMembers.slice(1)],
      [ChannelMembers, [], ChannelMembers],
    ])(
      'should retrun array without ignored members',
      (channelMembers, ignoredMembers, expected) => {
        const result = filterIgnoredMembers(channelMembers, ignoredMembers)
        expect(result).toStrictEqual(expected)
      }
    )

    it('should throw error if there are no members left', () => {
      expect(() => filterIgnoredMembers(ChannelMembers, ChannelMembers)).toThrow(
        'No members left to pick from'
      )
    })
  })

  describe('getRandomArrayElements', () => {
    const array = times(4, Number)
    it.each`
      requestedCount | expected
      ${2}           | ${2}
      ${10}          | ${array.length}
      ${0}           | ${0}
      ${-1}          | ${0}
    `(
      `should return $expected elements with array lenght ${array.length} and requested count $requestedCount`,
      ({ requestedCount, expected }: { requestedCount: number; expected: number }) => {
        const result = getRandomArrayElements(array, requestedCount)
        expect(result).toHaveLength(expected)
      }
    )

    it('should return no elements if array is empty', () => {
      const emptyArray: string[] = []
      const requestedCount = 1
      const result = getRandomArrayElements(emptyArray, requestedCount)
      expect(result).toHaveLength(0)
    })
  })
})
