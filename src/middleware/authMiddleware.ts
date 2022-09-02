import { Context, Next } from 'koa'
import * as jwt from 'jsonwebtoken'
import CONFIG from '../config/default'
import { JsonWebTokenError, TokenExpiredError } from '../constant/errType'
import { error } from '../lib'

//用户token验证
export const auth = async (ctx: Context, next: Next) => {
  // const { authorization = '' } = ctx.request.header
  // const token = authorization?.replace('Bearer ', '')
  const token = ctx.cookies.get('userpid')
  // console.log(res);
  
  try {
    //res中包含了id，user_name,admin等信息
    const res = jwt.verify(token as string, CONFIG.JWT_SECRET)
    ctx.state.user = res
  } catch (err: any) {
    switch (err.name) {
      case 'TokenExpiredError':
        console.error('token已过期', err)
        ctx.body = error(TokenExpiredError)
        return
      case 'JsonWebTokenError':
        console.error('无效的token', err)
        ctx.body = error(JsonWebTokenError)
        return
    }
    ctx.status = 401
  }

  await next()
}
