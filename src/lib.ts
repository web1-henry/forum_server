import * as bcrypt from "bcryptjs";
import CONFIG from "./config/default";
export const checkPassword = (password: string) => {
  return bcrypt.compareSync(password, CONFIG.JWT_SECRET);
};
