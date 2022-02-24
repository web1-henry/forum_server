import { Context, Next } from "koa";
import { userFormatError,userAlreadyExisted } from "../constant/errType";
import { getUserInfo } from "../service/userService";

export const userValidator = async (ctx: Context, next: Next) => {
  const { user_name, password } = <Record<string, string>>ctx.request.body;
  //合法性
  if (!user_name || !password) {
    console.error("用户名或密码为空", ctx.request.body);
    ctx.app.emit("error", userFormatError, ctx);
    ctx.status = 400;
    return;
  }

  await next();
};

export const varifyUser = async (ctx: Context, next: Next) => {
  const { user_name } = ctx.request.body;
  //合理性
  if (await getUserInfo(user_name)) {
    console.error("用户已经存在", ctx.request.body)
    ctx.app.emit('error',userAlreadyExisted,ctx)
    ctx.status = 409; //409表示有冲突
    return;
  }

  await next();
};
