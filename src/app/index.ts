import * as Koa from "koa";
import * as KoaBody from "koa-body";
import userRouter from "../routes/userRoute";
import { errHandler } from "./errHandler";

const app = new Koa();

app.use(KoaBody()).use(userRouter.routes());

app.on("error", errHandler);

export default app;