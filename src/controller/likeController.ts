import { Context } from 'koa'
import {
  getLikesListError,
  likeAnswerError,
  likeQuestionError,
} from '../constant/errType'
import { error, success } from '../lib'
import {
  findAnswerAllLike,
  findAnswerLike,
  updateAnswerLike,
} from '../service/answerLikeService'
import { answerfindOne, answerLiked } from '../service/answerService'
import {
  findAllLike,
  findQuestionLike,
  updateLike,
} from '../service/likeService'
import { find, liked } from '../service/questionService'
import { AnswerData, LikeData, QuestionData } from '../type'

//点赞问题
export async function likeQuestion(ctx: Context) {
  const { questionid } = <Record<string, string>>ctx.request.body
  const detail = (await find(questionid)) as QuestionData
  const likes = detail.likes
  const userid = ctx.state.user._id
  try {
    const res = await findQuestionLike(userid, questionid)
    await liked(likes, questionid, !res[0].isLike)
    await updateLike(userid, questionid, res[0].isLike)
    ctx.body = success({
      message: !res[0].isLike ? '点赞成功' : '取消成功',
      isLike: !res[0].isLike ? true : false,
    })
  } catch (err) {
    ctx.body = error(likeQuestionError)
    console.error(err)
  }
}

//点赞回答
export async function likeAnswer(ctx: Context) {
  const { answerid } = <Record<string, string>>ctx.request.body
  const detail = (await answerfindOne(answerid)) as AnswerData
  const likes = detail.likes
  const userid = ctx.state.user._id
  try {
    const res = await findAnswerLike(userid, answerid)
    await answerLiked(likes, answerid, !res[0].isLike)
    await updateAnswerLike(userid, answerid, res[0].isLike)
    ctx.body = success({
      message: !res[0].isLike ? '点赞成功' : '取消成功',
      isLike: !res[0].isLike ? true : false,
    })
  } catch (err) {
    console.error(err)
    ctx.body = error(likeAnswerError)
  }
}

//获取点赞列表
export async function getLikesList(ctx: Context) {
  const { _id } = <Record<string, string>>ctx.state.user
  const { offset = 0, limit = 10, site = 'question' } = ctx.request.body

  try {
    const res =
      site === 'question'
        ? await findAllLike(offset, limit, _id)
        : await findAnswerAllLike(offset, limit, _id)
    ctx.body = success(res)
  } catch (err) {
    console.error(err)
    ctx.body = error(getLikesListError)
  }
}

//获取点赞信息
export async function getLikesInfo(ctx: Context) {
  const { list, site = 'question' } = ctx.request.body
  const data = eval(JSON.parse(list))
  const userid = ctx.state.user._id
  let res
  let a = []
  try {
    if (site === 'question') {
      for (let i = 0; i < data.length; i++) {
        res = await findQuestionLike(userid, data[i])
        a.push(res[0].isLike)
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        res = await findAnswerLike(userid, data[i])
        a.push(res[0].isLike)
      }
    }
    ctx.body = success(a)
  } catch (err) {
    console.log(err)
  }
}
