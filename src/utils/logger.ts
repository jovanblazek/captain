import { once } from 'lodash'
import { createLogger, format, transports } from 'winston'

const { NODE_ENV } = process.env

type LogItem = {
  level: string
  message: string
  data?: Record<string, unknown>
  error?: string
  timestamp?: string
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const TIMESTAMP_FORMAT = { format: 'YYYY-MM-DD HH:mm:ss' }

const formatData = (item: LogItem) => {
  const { level, message, timestamp, ...rest } = item
  const stringifiedRest = JSON.stringify(rest, null, '  ')
  return stringifiedRest !== '{}' ? `\n\x1b[32mAdditional data:\x1b[39m\n${stringifiedRest}` : ''
}
const formatError = (item: LogItem) => (item.error ? ` - ${item.error}` : '')

// eslint-disable-next-line @typescript-eslint/naming-convention
const consoleFormatter = format.combine(
  format.colorize(),
  format.timestamp(TIMESTAMP_FORMAT),
  format.printf(
    (item: LogItem) =>
      `${item.timestamp || ''} [${item.level}]: ${item.message}${formatData(item)}${formatError(
        item
      )}`
  )
)

const initLogger = once(() =>
  createLogger({
    level: 'debug',
    format: consoleFormatter,
    transports: [new transports.Console()],
    silent: NODE_ENV === 'test',
  })
)

// eslint-disable-next-line @typescript-eslint/naming-convention
const logger = initLogger()

const Log = {
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
}
export default Log
