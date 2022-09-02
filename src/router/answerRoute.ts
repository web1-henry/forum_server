import * as Router from 'koa-router'
import { answer, deleteAnswer, getAnswerList } from '../controller/answerController'
import { auth } from '../middleware/authMiddleware'

const router = new Router({ prefix: '/api/answer' })

//发布回答
router.post('/add', auth, answer)

//获取回答列表
router.post('/list', getAnswerList)

//获取我的问答列表
router.post('/mine', auth, getAnswerList)

//删除回答
router.post('/delete', auth, deleteAnswer)

export default router
