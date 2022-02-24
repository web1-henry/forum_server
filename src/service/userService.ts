import User from "../model/userModel";
import { v4 } from "uuid";
import { Result, UserData } from "../type";

export async function createUser(user_name: string, password: string) {
  const res = (await User.create({
    _id: v4(),
    user_name,
    password,
  })) as Result<UserData>;
  return res.dataValues;
}
export async function getUserInfo(user_name: string) {
  const whereOpt = {};
  user_name && Object.assign(whereOpt, { user_name });
  const res = (await User.findOne({
    attributes: ["user_name"],
    where: whereOpt,
  })) as Result<UserData>;

  return res ? res.dataValues : null;
}
