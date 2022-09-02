import * as Router from "koa-router"
import * as fs from 'fs'

//路由文件自动加载
const router = new Router()
fs.readdirSync(__dirname).forEach(file => {
    if(file !== 'index.ts'){
       let r = require('./' + file)
       router.use(r.routes())
    }
});

export default router