import * as Router from "koa-router";
import UserController from "../controller/userController";

const { register } = UserController;

const router = new Router({ prefix: "/api/users" });

router.post("/register", register);

export default router;