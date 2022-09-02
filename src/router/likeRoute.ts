import * as Router from 'koa-router'
import {
  getLikesInfo,
  getLikesList,
  likeAnswer,
  likeQuestion,
} from '../controller/likeController'
import { auth } from '../middleware/authMiddleware'

const router = new Router({ prefix: '/api/like' })

//点赞问题
router.post('/question', auth, likeQuestion)

//点赞回答
router.post('/answer', auth, likeAnswer)

//获取点赞列表
router.post('/list', auth, getLikesList)

//获取点赞信息
router.post('/info', auth, getLikesInfo)

export default router
