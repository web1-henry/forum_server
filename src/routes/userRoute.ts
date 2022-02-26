import * as Router from "koa-router";
import { login, register, update } from "../controller/userController";
import { auth } from "../middleware/authMiddleware";
import {
  userValidator,
  varifyRegister,
  varifyLogin,
} from "../middleware/userMiddleware";

const router = new Router({ prefix: "/api/users" });

//注册路由
router.post("/register", userValidator, varifyRegister, register);

//登陆路由
router.post("/login", userValidator, varifyLogin, login);

//修改密码路由
router.patch("/update", auth, update);

export default router;
