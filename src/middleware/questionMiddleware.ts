import { Context, Next } from 'koa'
import { questionEmptyError } from '../constant/errType'
import { error } from '../lib'
import { find, updatedViews } from '../service/questionService'
import { QuestionData } from '../type'

//验证内容合法性
export const questionValidator = async (ctx: Context, next: Next) => {
  const { title, content } = <Record<string, string>>ctx.request.body
  if (!!!(title.trim() || content.trim())) {
    console.error('标题或内容为空')
    ctx.body = error(questionEmptyError)
    ctx.stat = 400
    return
  }

  await next()
}

export const viewsIncrease = async (ctx: Context, next: Next) => {
  try {
    const { questionid } = <Record<string, string>>ctx.request.body
    const res = (await find(questionid)) as QuestionData
    await updatedViews(res.views, questionid)
    await next()
  } catch (err) {
    console.error('浏览量增加失败', err)
  }
}
