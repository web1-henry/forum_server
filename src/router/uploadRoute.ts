import * as Router from 'koa-router'
import { upload } from '../controller/uploadController'
import { auth } from '../middleware/authMiddleware'

const router = new Router({ prefix: '/api' })

//上传图片
router.post('/upload', auth, upload)

export default router
