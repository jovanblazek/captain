import { App, SlackViewAction } from '@slack/bolt'
import ValidationError from 'classes/ValidationError'
import { scheduleMemberCron } from 'cron/crons'
import Log from 'utils/logger'
import { sendMessage } from 'utils/messages'
import Prisma from 'utils/prismaClient'
import { getModalData, MemberCronSetupValidationSchema } from './validation'

export const memberCronSetup = async (modalBody: SlackViewAction, slackAppInstance: App) => {
  const userInput = getModalData(modalBody)
  const validationResult = MemberCronSetupValidationSchema.safeParse(userInput)

  if (!validationResult.success) {
    throw new ValidationError(validationResult.error.flatten())
  }

  const { cronId, userId, channelId, schedule, message, ignoredMembers } = validationResult.data

  const savedCron = cronId
    ? await Prisma.cron.upsert({
        where: {
          id: cronId,
        },
        create: {
          teamId: modalBody.view.team_id,
          channelId,
          schedule,
          message,
          MembersCron: {
            create: {
              ignoredMembers,
            },
          },
        },
        update: {
          schedule,
          message,
          MembersCron: {
            update: {
              ignoredMembers,
            },
          },
        },
        include: {
          MembersCron: true,
        },
      })
    : await Prisma.cron.create({
        data: {
          teamId: modalBody.view.team_id,
          channelId,
          schedule,
          message,
          MembersCron: {
            create: {
              ignoredMembers,
            },
          },
        },
        include: {
          MembersCron: true,
        },
      })
  Log.info(`${cronId ? 'Upserted' : 'Created'} cron job for ${channelId} with schedule ${schedule}`)

  scheduleMemberCron(savedCron, {
    ignoredMembers,
    slackAppInstance,
  })
  await sendMessage({ channelId, userId, text: 'Aye aye sir! 🫡' }, slackAppInstance)
}
