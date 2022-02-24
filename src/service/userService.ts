import User from "../model/userModel";
import { v4 } from "uuid";
import { Result, UserData, UserSearchCondition } from "../type";

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
export async function getUserInfo(condition:UserSearchCondition) {
  const whereOpt = {};
  condition && Object.assign(whereOpt, { ...condition });
  
  const res = (await User.findOne({
    attributes: ["user_name", "_id", "admin", "password", "createdAt"],
    where: whereOpt,
  })) as Result<UserData>;
  
  return res ? res.dataValues : null;
}
