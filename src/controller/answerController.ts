import { Context } from 'koa'
import {
  answerAddError,
  deleteAnswerError,
  deleteQuestionError,
  getAnswerLisrError,
} from '../constant/errType'
import { error, success } from '../lib'
import {
  addAnswer,
  answerdeleted,
  answerFindALl,
  answerfindOne,
} from '../service/answerService'
import { updatedAnswer } from '../service/questionService'
import { AnswerData, QuestionData } from '../type'

//添加回答
export async function answer(ctx: Context) {
  const { questionid, content } = <Record<string, string>>ctx.request.body
  const userid = ctx.state.user._id

  try {
    const res = await addAnswer(questionid, userid, content)
    await updatedAnswer(questionid)
    ctx.body = success({
      message: '回答添加成功',
      answerid: res._id,
    })
  } catch (err) {
    console.error(err)
    ctx.body = error(answerAddError)
  }
}

//获取回答列表
export async function getAnswerList(ctx: Context) {
  const {
    offset = 0,
    limit = 10,
    sort = 'latest',
    questionid = '',
    site = 'all',
  } = <Record<string, any>>ctx.request.body
  const userid = site === 'mine' ? ctx.state.user._id : ''
  try {
    const res = await answerFindALl(offset, limit, sort, questionid, userid)
    ctx.body = success(res)
  } catch (err) {
    console.error(err)
    ctx.body = error(getAnswerLisrError)
  }
}

//删除回答
export async function deleteAnswer(ctx: Context) {
  const { answerid } = <Record<string, string>>ctx.request.body
  const { userid, questionid } = (await answerfindOne(answerid)) as AnswerData

  if (userid !== ctx.state.user._id) {
    ctx.body = error(deleteQuestionError)
    return
  }
  try {
    await answerdeleted(answerid)
    await updatedAnswer(questionid)
    ctx.body = success({ message: '删除成功' })
  } catch (err) {
    console.log('删除回答失败', ctx)
    ctx.body = error(deleteAnswerError)
  }
}
