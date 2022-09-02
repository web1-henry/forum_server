import * as Koa from 'koa'
import * as KoaCore from 'koa2-cors'
import * as KoaBody from 'koa-body'
import * as KoaStatic from 'koa-static'
import { errHandler } from './errHandler'
import userRoute from '../router/userRoute'
import questionRoute from '../router/quetionRoute'
import likeRoute from '../router/likeRoute'
import answerRoute from '../router/answerRoute'
import uploadRoute from '../router/uploadRoute'

const path = require('path')

const app = new Koa()
app.keys = ['forum']
app.use(KoaCore())
app
  .use(
    KoaBody({
      multipart: true,
    }),
  )
  .use(KoaStatic(path.join(__dirname, '../uploads')))
  .use(userRoute.routes())
  .use(questionRoute.routes())
  .use(likeRoute.routes())
  .use(answerRoute.routes())
  .use(uploadRoute.routes())
//统一的错误处理
app.on('error', errHandler)

export default app
