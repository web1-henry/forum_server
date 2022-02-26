import * as bcrypt from "bcryptjs";
import CONFIG from "./config/default";

//检验密码是否一致
export const checkPassword = (password: string) => {
  return bcrypt.compareSync(password, CONFIG.JWT_SECRET);
};

export const cryptPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
};
