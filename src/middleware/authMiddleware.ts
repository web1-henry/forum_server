import { Context, Next } from "koa";
import * as jwt from "jsonwebtoken";
import CONFIG from "../config/default";
import { JsonWebTokenError, TokenExpiredError } from "../constant/errType";

//用户token验证
export const auth = async (ctx: Context, next: Next) => {
  const { authorization } = ctx.request.header;
  const token = authorization?.replace("Bearer ", "");
  try {
    //res中包含了id，user_name,admin等信息
    const res = jwt.verify(token as string, CONFIG.JWT_SECRET);
    ctx.state.user = res;
  } catch (err:any) {
    switch (err.name) {
      case "TokenExpiredError":
        console.error("token已过期", err);
        ctx.app.emit("error", TokenExpiredError, ctx);
        return;
      case "JsonWebTokenError":
        console.error("无效的token", err);
        ctx.app.emit("error", JsonWebTokenError, ctx);
        return
    }
  }

  await next();
};
