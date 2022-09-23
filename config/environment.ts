import dotenv from 'dotenv'
import path from 'path'

const ENV_FILE_PATH = process.env.NODE_ENV === 'test' ? '../.env.test' : '../.env'
dotenv.config({ path: path.join(__dirname, ENV_FILE_PATH) })
