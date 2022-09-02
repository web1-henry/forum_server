import { Context } from 'koa'
import {
  deleteQuestionError,
  getQuestionDetailError,
  getQuestionListError,
  qustionAddError,
} from '../constant/errType'
import { error, success } from '../lib'
import { add, deleted, find, findAll } from '../service/questionService'
import { QuestionData } from '../type'

//添加问题
export async function addQuestion(ctx: Context) {
  const { title, content } = <Record<string, string>>ctx.request.body
  const author = ctx.state.user._id

  try {
    const res = await add(author, title, content)
    ctx.status = 201
    ctx.body = success({
      message: '问题添加成功',
      questionid: res._id,
    })
  } catch (err) {
    console.error(err)
    ctx.stat = 400
    ctx.body = error(qustionAddError)
  }
}

//获取问题列表
export async function getQuestionList(ctx: Context) {
  const { offset = 0, limit = 10, sort = 'latest' } = ctx.request.body
  try {
    const res = await findAll(offset, limit, sort)
    ctx.body = success(res)
  } catch (err) {
    ctx.body = error(getQuestionListError)
    console.error('获取文章列表失败', ctx)
  }
}

//获取我的问题列表
export async function getMineQuestionList(ctx: Context) {
  const { offset = 0, limit = 10, sort = 'latest' } = ctx.request.body
  const { _id } = ctx.state.user
  try {
    const res = await findAll(offset, limit, sort, _id)
    ctx.body = success(res)
  } catch (err) {
    ctx.body = error(getQuestionListError)
    console.error('获取文章列表失败', ctx)
  }
}

//获取问题详情
export async function getQuestionDetail(ctx: Context) {
  const { questionid } = <Record<string, string>>ctx.request.body

  try {
    const res = await find(questionid)
    ctx.body = success(res)
  } catch (err) {
    console.error('获取文章详情失败', ctx)
    ctx.body = error(getQuestionDetailError)
  }
}

//删除问题
export async function deleteQuestion(ctx: Context) {
  const { questionid } = <Record<string, string>>ctx.request.body
  const { author } = (await find(questionid)) as QuestionData
  if (author !== ctx.state.user._id) {
    ctx.body = error(deleteQuestionError)
    return
  }

  try {
    await deleted(questionid)
    ctx.body = success({
      message: '删除成功 ',
    })
  } catch (err) {
    console.error('删除文章失败', ctx)
    ctx.body = error(deleteQuestionError)
  }
}

//搜索问题
export async function search(ctx: Context) {
  const {
    offset = 0,
    limit = 10,
    sort = 'latest',
    keyword = '',
  } = ctx.request.body
  try {
    const res = await findAll(offset, limit, sort, undefined, keyword)
    ctx.body = success(res)
  } catch (err) {
    ctx.body = error(getQuestionListError)
  }
}
