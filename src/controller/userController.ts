import { Context } from 'koa'
import * as jwt from 'jsonwebtoken'
import {
  oldPasswordError,
  samePasswordError,
  updatePwdError,
  userAlreadyLogin,
  useregisterError,
  userLoginError,
} from '../constant/errType'
import {
  createUser,
  getUserInfo,
  getUserPassword,
  updateUserInfo,
} from '../service/userService'
import { UploadData, UserData, UserPassword } from '../type'
import CONFIG from '../config/default'
import { varifyPassword } from '../middleware/userMiddleware'
import { cryptPassword, error, success } from '../lib'
import { upload } from './uploadController'

//注册方法
export async function register(ctx: Context) {
  const {
    user_name,
    password,
    avatar = '',
  } = <Record<string, string>>ctx.request.body
  const hash = cryptPassword(password)

  try {
    const res = await createUser(user_name, hash, avatar)
    ctx.status = 200
    ctx.body = success({
      message: '用户注册成功',
      _id: res._id,
    })
  } catch (err) {
    console.error(err)
    ctx.body = error(useregisterError)
  }
}
//登陆方法
export async function login(ctx: Context) {
  const { user_name } = ctx.request.body

  //获取用户信息并颁发token
  try {
    const { password, ...res } = (await getUserInfo({ user_name })) as UserData
    const token = jwt.sign(res, CONFIG.JWT_SECRET, { expiresIn: '1d' })
    // if (res.isLogin) {
    //   ctx.body = error(userAlreadyLogin)
    //   ctx.cookies.set('userpid', token, {
    //     maxAge: 365 * 24 * 60 * 60,
    //     signed: true,
    //   })
    //   return
    // }
    await updateUserInfo({ user_name }, { isLogin: true })
    ctx.body = success({
      message: '用户登陆成功',
      token,
    })

    ctx.cookies.set('userpid', token, {
      maxAge: 365 * 24 * 60 * 60,
      signed: true,
    })
  } catch (err) {
    console.error('用户登陆失败', err)
    ctx.body = error(userLoginError)
  }
}
//修改密码
export async function update(ctx: Context) {
  try {
    const { _id } = ctx.state.user
    const { oldPassword, newPassword } = ctx.request.body
    const { password } = (await getUserPassword(_id)) as UserPassword
    const oldVarifyres = await varifyPassword(oldPassword, password)
    const newVarifyres = await varifyPassword(newPassword, password)
    if (!oldVarifyres) {
      console.error('原密码不正确', { oldPassword })
      ctx.body = error(oldPasswordError)
      return
    }
    if (newVarifyres) {
      console.log('新密码不能与旧密码相同', { newPassword })
      ctx.body = error(samePasswordError)
      return
    }
    const n = cryptPassword(newPassword)
    const res = await updateUserInfo({ password }, { password: n })
    if (!res) {
      console.error('修改密码失败', { oldPassword })
      ctx.body = error(updatePwdError)
      return
    }
    ctx.body = success({
      message: '修改密码成功',
    })
  } catch (err) {
    console.error('修改密码失败', err)
    ctx.body = error(updatePwdError)
  }
}

//登出
export async function logout(ctx: Context) {
  const { user_name } = ctx.state.user
  await updateUserInfo({ user_name }, { isLogin: false })
  ctx.cookies.set('userpid', '', {
    maxAge: 0,
    signed: false,
  })
  ctx.body = success({
    stat: 'OK',
    message: '登出成功',
  })
}

//上传头像
export async function avatar(ctx: Context) {
  const { _id } = ctx.state.user
  const res = (await upload(ctx)) as UploadData
  const user = await updateUserInfo(
    { _id },
    { avatar: res.fileDatas[0].fileName },
  )
  ctx.body = {
    stat: 'OK',
    user,
  }
}

export async function getUser(ctx: Context) {
  const { _id } = ctx.state.user
  const res = await getUserInfo({ _id })
  ctx.body = {
    stat: 'OK',
    data:res,
  }
}
