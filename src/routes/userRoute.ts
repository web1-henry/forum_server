import * as Router from "koa-router";
import {register} from "../controller/userController";
import { userValidator, varifyUser } from "../middleware/userMiddleware";

const router = new Router({ prefix: "/api/users" });

router.post("/register", userValidator, varifyUser, register);

export default router;