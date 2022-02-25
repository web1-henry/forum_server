import { Context } from "koa";
import * as jwt from "jsonwebtoken";
import {
  oldPasswordError,
  updatePwdError,
  useregisterError,
} from "../constant/errType";
import {
  createUser,
  getUserInfo,
  getUserPassword,
  updateUserInfo,
} from "../service/userService";
import { UserData, UserPassword } from "../type";
import CONFIG from "../config/default";
import { varifyPassword } from "../middleware/userMiddleware";

//注册方法
export async function register(ctx: Context) {
  const { user_name, password } = <Record<string, string>>ctx.request.body;

  try {
    const res = await createUser(user_name, password);
    ctx.status = 200;
    ctx.body = {
      stat: "OK",
      data: {
        message: "用户注册成功",
        _id: res._id,
      },
    };
  } catch (err) {
    console.error(err);
    ctx.app.emit("error", useregisterError, ctx);
  }
}
//登陆方法
export async function login(ctx: Context) {
  const { user_name } = ctx.request.body;

  //获取用户信息并颁发token
  try {
    const { password, ...res } = (await getUserInfo({ user_name })) as UserData;
    ctx.body = {
      stat: "OK",
      data: {
        message: "用户登陆成功",
        token: jwt.sign(res, CONFIG.JWT_SECRET, { expiresIn: "1d" }),
      },
    };
  } catch (err) {
    console.error("用户登陆书失败", err);
  }
}
//修改密码
export async function update(ctx: Context) {
  try {
    const { _id } = ctx.state.user;
    const { oldPassword } = ctx.request.body;
    const { password } = (await getUserPassword(_id)) as UserPassword;
    const varifyres = await varifyPassword(oldPassword, password);
    if (!varifyres) {
      console.error("原密码不正确", { oldPassword });
      ctx.app.emit("error", oldPasswordError, ctx);
      return;
    }
    const newPassword = ctx.request.body.password;
    const res = await updateUserInfo({ password }, { password: newPassword });
    if (!res) {
      console.error("修改密码失败", { oldPassword });
      ctx.app.emit("error", updatePwdError, ctx);
    }
    ctx.body = {
      stat: "OK",
      data: {
        message: "修改密码成功",
      },
    };
  } catch (err) {
    console.error("修改密码失败", err);
    ctx.app.emit("error", updatePwdError, ctx);
  }
}
