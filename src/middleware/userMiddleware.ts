import { Context, Next } from "koa";
import {
  userFormatError,
  userAlreadyExisted,
  useregisterError,
  userNotExist,
  userLoginError,
  userPwdError,
} from "../constant/errType";
import { getUserInfo } from "../service/userService";
import * as bcrypt from "bcryptjs";

//验证合法性
export const userValidator = async (ctx: Context, next: Next) => {
  const { user_name, password } = <Record<string, string>>ctx.request.body;
  if (!user_name || !password) {
    console.error("用户名或密码为空", ctx.request.body);
    ctx.app.emit("error", userFormatError, ctx);
    ctx.status = 400;
    return;
  }

  await next();
};

//验证注册合理性
export const varifyRegister = async (ctx: Context, next: Next) => {
  const { user_name } = <Record<string, string>>ctx.request.body;
  //合理性
  try {
    if (await getUserInfo({user_name})) {
      console.error("用户已经存在", { user_name });
      ctx.app.emit("error", userAlreadyExisted, ctx);
      ctx.status = 409; //409表示有冲突
      return;
    }
  } catch (err) {
    console.error("获取用户信息错误");
    ctx.app.emit("error", useregisterError, ctx);
    return;
  }

  await next();
};

//密码加密
export const cryptPassword = async (ctx: Context, next: Next) => {
  const { password } = ctx.request.body;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt); //密文

  ctx.request.body.password = hash;

  await next();
};

//验证登陆
export const varifyLogin = async (ctx: Context, next: Next) => {
  const { user_name, password } = <Record<string, string>>ctx.request.body;

  // 首先查询用户信息，看用户名是否存在
  try {
    const res = await getUserInfo({user_name});
    
    if (!res) {
      console.error("该用户不存在", user_name);
      ctx.app.emit("error", userNotExist, ctx);
      return;
    }
    //再验证密码是否一致
    if (!bcrypt.compareSync(password, res.password)) {
      ctx.app.emit("error", userPwdError, ctx);
      return;
    }
  } catch (err) {
    console.error(err);
    ctx.app.emit("error", userLoginError, ctx);
    return;
  }

  await next();
};
