import { Context } from "koa";
import * as jwt from "jsonwebtoken";
import {
  oldPasswordError,
  samePasswordError,
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
import { cryptPassword } from "../lib";

//注册方法
export async function register(ctx: Context) {
  const { user_name, password } = <Record<string, string>>ctx.request.body;
  const hash = cryptPassword(password);

  try {
    const res = await createUser(user_name, hash);
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
    console.error("用户登陆失败", err);
  }
}
//修改密码
export async function update(ctx: Context) {
  try {
    const { _id } = ctx.state.user;
    const { oldPassword, newPassword } = ctx.request.body;
    const { password } = (await getUserPassword(_id)) as UserPassword;
    const oldVarifyres = await varifyPassword(oldPassword, password);
    const newVarifyres = await varifyPassword(newPassword, password);
    if (!oldVarifyres) {
      console.error("原密码不正确", { oldPassword });
      ctx.app.emit("error", oldPasswordError, ctx);
      return;
    }
    if (newVarifyres) {
      console.log("新密码不能与旧密码相同", { newPassword });
      ctx.app.emit("error", samePasswordError, ctx);
      return;
    }
    const n = cryptPassword(newPassword);
    const res = await updateUserInfo({ password }, { password: n });
    if (!res) {
      console.error("修改密码失败", { oldPassword });
      ctx.app.emit("error", updatePwdError, ctx);
      return;
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
