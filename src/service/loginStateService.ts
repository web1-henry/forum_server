import LoginState from '../model/loginStatModel'
import { Result, LoginStateData } from '../type'

//记录登录状态
export async function addLoginState(username: string, state: boolean) {
  const res = (await LoginState.create({
    username,
    state,
  })) as Result<LoginStateData>
  return res.dataValues
}

//修改登陆状态
export async function updateLoginState(username: string) {
  const res = await getLoginState(username)
  if (res !== null) {
    LoginState.update({ state: !res.state }, { where: { username } })
  }
}

//获取登录状态
export async function getLoginState(username: string) {
  const res = (await LoginState.findOne({
    where: { username },
  })) as Result<LoginStateData>
  return res ? res.dataValues : null
}
