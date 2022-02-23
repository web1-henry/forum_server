import { Register_condition } from "../type";
import { Context, Next } from "koa";
import UserService from "../service/userService";

const { createUser } = UserService
const UserController = (() => {
    async function register(ctx:Context, next:Next) {
        const { user_name, password } = <Register_condition>ctx.request.body;
        const res = await createUser(user_name, password)
        ctx.body = ctx.request.body;
    }
    async function login(ctx:any, next:Next) {
        ctx.body = "登陆成功"
    }
    return {register, login}
})()

export default UserController