import Answer from '../model/answerModel'
import { v4 } from 'uuid'
import { AnswerData, Result } from '../type'
import { OrderItem } from 'sequelize/types'
import { Op } from 'sequelize'
import User from '../model/userModel'

//添加回答
export async function addAnswer(
  questionid: string,
  userid: string,
  content: string,
) {
  const res = (await Answer.create({
    _id: v4(),
    content,
    questionid,
    userid,
  })) as Result<AnswerData>
  return res.dataValues
}

//获取列表
export async function answerFindALl(
  offset: number,
  limit: number,
  sort: string,
  questionid?: string,
  userid?: string,
) {
  const condition = (
    sort === 'latest' ? [['createdAt', 'DESC']] : [['likes', 'DESC']]
  ) as OrderItem[]
  const whereOpt = {
    [Op.and]: {
      deleted: {
        [Op.ne]: 1,
      },
    },
  }
  userid && Object.assign(whereOpt, { ...{ userid } })
  questionid && Object.assign(whereOpt, { ...{ questionid } })
  const res = await Answer.findAndCountAll({
    offset,
    limit,
    order: condition,
    attributes: {
      exclude: ['updatedAt'],
    },
    include: [
      {
        model: User,
        attributes: {
          exclude: ['password', 'updatedAt'],
        },
      },
    ],
    where: whereOpt,
  })
  return res
}

export async function answerfindOne(answerid: string) {
  const res = (await Answer.findOne({
    where: { _id: answerid },
  })) as Result<AnswerData>

  return res ? res.dataValues : null
}

export async function answerdeleted(answerid: string) {
  const res = await Answer.update({ deleted: 1 }, { where: { _id: answerid } })
  return res
}

export async function answerLiked(
  likes: number,
  answerid: string,
  stat: boolean,
) {
  const res = await Answer.update(
    { likes: stat ? likes + 1 : likes - 1 },
    { where: { _id: answerid } },
  )
  return res
}

//获取回答数量
export async function getAnswerCount(questionid: string) {
  const res = await Answer.count({ where: { questionid, deleted: false } })
  return res
}
