import * as Koa from 'koa'
import * as KoaBody from 'koa-body'
import userRouter from "../routes/userRoute";

const app = new Koa();

app.use(KoaBody()).use(userRouter.routes());

export default app;
