import { Context } from "koa";
import { createUser } from "../service/userService";

export async function register(ctx: Context) {
  const { user_name, password } = <Record<string, string>>ctx.request.body;

  const res = await createUser(user_name, password);
  ctx.status = 200;
  ctx.body = {
    stat: "OK",
    data: {
      message: "用户注册成功",
      _id: res._id,
    },
  };
}
export async function login(ctx: Context) {
  ctx.body = "登陆成功";
}
