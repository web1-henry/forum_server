import { Context, Next } from 'koa'
import {
  userFormatError,
  userAlreadyExisted,
  useregisterError,
  userNotExist,
  userLoginError,
  userPwdError,
} from '../constant/errType'
import { getUserInfo, getUserPassword } from '../service/userService'
import * as bcrypt from 'bcryptjs'
import { UserData, UserPassword } from '../type'
import { error } from '../lib'

//验证合法性
export const userValidator = async (ctx: Context, next: Next) => {
  const { user_name, password } = <Record<string, string>>ctx.request.body
  if (!user_name || !password) {
    console.error('用户名或密码为空', ctx.request.body)
    ctx.body = error(userFormatError)
    ctx.status = 400
    return
  }

  await next()
}

//验证注册合理性
export const varifyRegister = async (ctx: Context, next: Next) => {
  const { user_name } = <Record<string, string>>ctx.request.body
  //合理性
  try {
    if (await getUserInfo({ user_name })) {
      console.error('用户已经存在', { user_name })
      ctx.body = error(userAlreadyExisted)
      ctx.status = 409 //409表示有冲突
      return
    }
  } catch (err) {
    console.error('获取用户信息错误')
    ctx.body = error(useregisterError)
    return
  }

  await next()
}

//验证登陆
export const varifyLogin = async (ctx: Context, next: Next) => {
  const { user_name, password } = <Record<string, string>>ctx.request.body

  // 首先查询用户信息，看用户名是否存在
  try {
    const user = (await getUserInfo({ user_name })) as UserData
    if (!user) {
      ctx.body = error(userNotExist)
      console.error('该用户不存在', user_name)
      return
    }
    const res = (await getUserPassword(user._id)) as UserPassword

    //再验证密码是否一致
    if (!(await varifyPassword(password, res.password))) {
      ctx.body = error(userPwdError)
      return
    }
  } catch (err) {
    console.error(err)
    ctx.body = error(userLoginError)
    return
  }

  await next()
}

//验证密码是否一致
export const varifyPassword = async (o: string, n: string) => {
  return bcrypt.compareSync(o, n)
}
