import { Cron } from '@prisma/client'
import { App } from '@slack/bolt'
import { scheduleCronJob } from 'cron/scheduleCron'
import Log from 'utils/logger'
import { picker, PickerOptions } from 'utils/picker'
import Prisma from 'utils/prismaClient'

const loadMemberCrons = () =>
  Prisma.membersCron.findMany({
    include: {
      cron: true,
    },
  })

const executeMemberCron = (pickerOptions: PickerOptions, slackAppInstance: App) => {
  picker(pickerOptions, slackAppInstance).catch((error) => {
    Log.error(error)
  })
}

export const scheduleMemberCron = (
  cron: Pick<Cron, 'channelId' | 'message' | 'schedule'>,
  options: {
    ignoredMembers: PickerOptions['ignoredMembers']
    slackAppInstance: App
  }
) => {
  scheduleCronJob({
    cron,
    executeFunction: () =>
      executeMemberCron(
        {
          channelId: cron.channelId,
          message: cron.message,
          ignoredMembers: options.ignoredMembers,
        },
        options.slackAppInstance
      ),
  })
}

export const initMemberCrons = async (slackAppInstance: App) => {
  try {
    const memberCrons = await loadMemberCrons()
    memberCrons.forEach(({ cron, ...memberCronOptions }) => {
      scheduleMemberCron(cron, {
        ignoredMembers: memberCronOptions.ignoredMembers,
        slackAppInstance,
      })
    })
    return memberCrons.length
  } catch (error) {
    Log.error('There was an error while loading member crons', error)
    return 0
  }
}
