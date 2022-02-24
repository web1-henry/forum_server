import * as dotenv from 'dotenv'
import { Env } from '../type'

dotenv.config()

const CONFIG = <Env>process.env

export default CONFIG