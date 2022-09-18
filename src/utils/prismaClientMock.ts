import { PrismaClient } from '@prisma/client'
// eslint-disable-next-line import/no-extraneous-dependencies
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended'
import prisma from './prismaClient'

jest.mock('./prismaClient', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  mockReset(PrismaMock)
})

export const PrismaMock = prisma as unknown as DeepMockProxy<PrismaClient>
