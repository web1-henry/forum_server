import * as bcrypt from 'bcryptjs'
import { Context } from 'koa'
import CONFIG from './config/default'
import { answerfindOne } from './service/answerService'
import { find } from './service/questionService'
import { getUserInfo } from './service/userService'
import { Error } from './type'

//检验密码是否一致
export const checkPassword = (password: string) => {
  return bcrypt.compareSync(password, CONFIG.JWT_SECRET)
}

//密码加密
export const cryptPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)

  return hash
}

//检查是否已被删除
export const checkDeleted = async (_id: string, site: string) => {
  try {
    switch (site) {
      case 'user':
        const user = await getUserInfo({ _id })
        return user?.deleted
      case 'question':
        const question = await find(_id)
        return question?.deleted
      case 'answer':
        const answer = await answerfindOne(_id)
        return answer?.deleted
    }
  } catch (err) {
    console.error()
  }
}

//检查文件
export const checkFile = async (type: string) => {
  const fileTypes = ['image/jpeg', 'image/png']
  if (type) {
    if (!fileTypes.includes(type)) {
      return false
    }
    return true
  }
}

export const success = (data: any) => {
  return {
    stat: 'OK',
    data,
  }
}

export const error = ( msg: Error) => {
  return {
    stat: 'error',
    msg,
  }
}
