import * as Router from 'koa-router'
import {
  avatar,
  getUser,
  login,
  logout,
  register,
  update,
} from '../controller/userController'
import { auth } from '../middleware/authMiddleware'
import {
  userValidator,
  varifyRegister,
  varifyLogin,
} from '../middleware/userMiddleware'

const router = new Router({ prefix: '/api/users' })

//注册路由
router.post('/register', userValidator, varifyRegister, register)

//登陆路由
router.post('/login', userValidator, varifyLogin, login)

//修改密码路由
router.patch('/update', auth, update)

//登出
router.post('/logout', auth, logout)

//上传头像
router.post('/avatar', auth, avatar)

//获取用户信息
router.post('/info', auth, getUser)

export default router
