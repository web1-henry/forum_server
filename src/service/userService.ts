import User from "../model/userModel";
import { v4 } from "uuid";
import { Result, UserData, UserPassword, UserSearchCondition } from "../type";

// 创建用户
export async function createUser(user_name: string, password: string) {
  const res = (await User.create({
    _id: v4(),
    user_name,
    password,
  })) as Result<UserData>;
  return res.dataValues;
}
//获取用户信息
export async function getUserInfo(condition: UserSearchCondition) {
  const whereOpt = {};
  condition && Object.assign(whereOpt, { ...condition });

  const res = (await User.findOne({
    attributes: ["user_name", "_id", "admin", "createdAt"],
    where: whereOpt,
  })) as Result<UserData>;

  return res ? res.dataValues : null;
}
//获取用户密码
export async function getUserPassword(id: string) {
  const res = (await User.findOne({
    attributes: ["password"],
    where: { _id: id },
  })) as Result<UserPassword>;

  return res ? res.dataValues : null;
}
//更新用户信息
export async function updateUserInfo(
  o: Record<string, string>,
  n: Record<string, string>
) {
  const res = await User.update(n, { where: o });
  return res ? res[0] : null
}
