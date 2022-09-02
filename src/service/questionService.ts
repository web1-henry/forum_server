import Question from '../model/questionModel'
import { v4 } from 'uuid'
import { QuestionData, Result } from '../type'
import { OrderItem } from 'sequelize/types/model'
import User from '../model/userModel'
import Answer from '../model/answerModel'
import { Op } from 'sequelize'
import { getAnswerCount } from './answerService'

//添加
export async function add(user_id: string, title: string, content: string) {
  const res = (await Question.create({
    _id: v4(),
    author: user_id,
    title,
    content,
  })) as Result<QuestionData>
  return res.dataValues
}

//查找所有
export async function findAll(
  offset: number,
  limit: number,
  sort: string,
  author?: string,
  keyword?: string,
) {
  const condition = (
    sort === 'latest' ? [['createdAt', 'DESC']] : [['views', 'DESC']]
  ) as OrderItem[]
  const whereOpt = { deleted: false }
  if (author) {
    Object.assign(whereOpt, { ...{ author } })
  }
  if (keyword) {
    Object.assign(whereOpt, {
      ...{
        [Op.or]: [
          { title: { [Op.regexp]: keyword } },
          { content: { [Op.regexp]: keyword } },
        ],
      },
    })
  }
  console.log(whereOpt)

  const res = await Question.findAndCountAll({
    offset,
    limit,
    order: condition,
    attributes: {
      exclude: ['updatedAt', 'deleted'],
    },
    include: [
      {
        model: User,
        attributes: {
          exclude: ['password', 'updatedAt', 'createdAt', 'deleted', 'isLogin'],
        },
      },
      {
        model: Answer,
        limit: 1,
        where: { deleted: false },
        order: [['likes', 'DESC']],
        attributes: {
          exclude: ['deleted'],
        },
        include: [
          {
            model: User,
            attributes: {
              exclude: [
                'password',
                'updatedAt',
                'createdAt',
                'deleted',
                'isLogin',
              ],
            },
          },
        ],
      },
    ],
    where: whereOpt,
  })
  return res
}

//查找一个
export async function find(questionId: string) {
  const res = (await Question.findOne({
    where: { _id: questionId },
    attributes: {
      exclude: ['deleted'],
    },
    include: [
      {
        model: User,
        attributes: {
          exclude: ['password', 'updatedAt', 'createdAt', 'deleted', 'isLogin'],
        },
      },
    ],
  })) as Result<QuestionData>

  return res ? res.dataValues : null
}

//删除
export async function deleted(questionid: string) {
  try {
    const res = await Question.update(
      { deleted: 1 },
      { where: { _id: questionid } },
    )
    await Answer.update({ deleted: 1 }, { where: { questionid } })
    return res
  } catch (err) {
    console.error(err)
  }
}

//更新浏览量
export async function updatedViews(views: number, questionid: string) {
  await Question.update({ views: views + 1 }, { where: { _id: questionid } })
}

//更新回答
export async function updatedAnswer(questionid: string) {
  const count = await getAnswerCount(questionid)
  console.log(count)

  await Question.update({ answers: count }, { where: { _id: questionid } })
}

//点赞
export async function liked(likes: number, questionid: string, stat: boolean) {
  const res = await Question.update(
    { likes: stat ? likes + 1 : likes - 1 },
    { where: { _id: questionid } },
  )
  return res
}
