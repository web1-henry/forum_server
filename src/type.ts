import Model from "sequelize/types/model";

export interface Env extends NodeJS.ProcessEnv {
  APP_PORT: string;
  MYSQL_HOST: string;
  MYSQL_PORT: string;
  MYSQL_USER: string;
  MYSQL_PWD: string;
  MYSQL_DB: string;
}

export interface Result<T> extends Model {
  dataValues: T;
}

export interface Error {
  code: string;
  message: string;
}

export interface UserData {
  _id: string;
  user_name: string;
  admin: boolean;
  password: string;
}
