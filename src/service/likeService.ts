import Like from '../model/questionLikeModel'
import { v4 } from 'uuid'
import { LikeData } from '../type'
import Question from '../model/questionModel'

//获取单条问题点赞信息
export async function findQuestionLike(userid: string, questionid: string) {
  const res = (await Like.findOrCreate({
    where: { userid, questionid },
    defaults: { _id: v4(), userid, questionid, isLike: false },
  })) as any
  return res
}

//更新问题点赞信息
export async function updateLike(
  userid: string,
  questionid: string,
  isLike: boolean,
) {
  await Like.update(
    { isLike: !isLike },
    {
      where: { userid, questionid },
    },
  )
}

//获取点赞列表
export async function findAllLike(
  offset: number,
  limit: number,
  userid: string,
) {
  const res = await Like.findAndCountAll({
    offset,
    limit,
    attributes: ['isLike'],
    include: [
      {
        model: Question,
        attributes: ['title', '_id'],
        where: {
          deleted: {
            $ne: 1,
          },
        },
      },
    ],
    where: {
      userid,
    },
  })
  return res
}
