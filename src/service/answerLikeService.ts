import { v4 } from 'uuid'
import Like from '../model/answerLikeModel'
import Answer from '../model/answerModel'
import { LikeData, Result } from '../type'

//获取单条回答点赞信息
export async function findAnswerLike(userid: string, answerid: string) {
  const res = (await Like.findOrCreate({
    where: { userid, answerid },
    defaults: { _id: v4(), userid, answerid, isLike: false },
  })) as any
  return res
}

//更新回答点赞信息
export async function updateAnswerLike(
  userid: string,
  answerid: string,
  isLike: boolean,
) {
  await Like.update(
    { isLike: !isLike },
    {
      where: { userid, answerid },
    },
  )
}

//获取点赞列表
export async function findAnswerAllLike(
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
        model: Answer,
        attributes: ['content', '_id'],
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
