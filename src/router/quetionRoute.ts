import * as Router from 'koa-router'
import {
  addQuestion,
  deleteQuestion,
  getMineQuestionList,
  getQuestionDetail,
  getQuestionList,
  search,
} from '../controller/questionController'
import { auth } from '../middleware/authMiddleware'
import {
  questionValidator,
  viewsIncrease,
} from '../middleware/questionMiddleware'

const router = new Router({ prefix: '/api/questions' })

//发布问题
router.post('/add', auth, questionValidator, addQuestion)

//获取问题列表
router.post('/list', getQuestionList)

//获取我的问题列表
router.post('/mine', auth, getMineQuestionList)

//获取问题详情
router.post('/detail', viewsIncrease, getQuestionDetail)

//删除问题
router.post('/delete', auth, deleteQuestion)

//搜索
router.post('/search',search)

export default router
