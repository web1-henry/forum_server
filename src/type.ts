import Model from 'sequelize/types/model'

export type Env = {
  [propName in Envconfig]: string
} & NodeJS.ProcessEnv

export type Envconfig =
  | 'APP_PORT'
  | 'MYSQL_HOST'
  | 'MYSQL_PORT'
  | 'MYSQL_USER'
  | 'MYSQL_PWD'
  | 'MYSQL_DB'
  | 'JWT_SECRET'

export interface Result<T> extends Model {
  dataValues: T
}

export interface UserSearchCondition {
  user_name?: string
  _id?: string
  admin?: boolean
}

export interface UserPassword {
  password: string
}

export interface Error {
  code: string
  message: string
}

export interface UserData {
  _id: string
  user_name: string
  admin: boolean
  password: string
  deleted: boolean
  isLogin: boolean
}

export enum admin {
  people = 0,
  admin = 1,
}

export interface QuestionData {
  _id: string
  author: string
  title: string
  content: string
  views: number
  answer: number
  likes: number
  deleted: number
}

export interface LikeData {
  _id: string
  userid: string
  questionid: string
  isLike: boolean
}

export interface AnswerData {
  _id: string
  content: string
  questionid: string
  userid: string
  likes: number
  deleted: boolean
}

export interface imgData {
  path: string
  name: string
  type: string
  hash: string
}

export interface ErrorDatas {
  fileName: string
  message: string
}

export interface LoginStateData {
  token: string
  state: boolean
}

export interface FileDatas {
  fileName: string
  fileId: string
}

export interface UploadData {
  fileDatas: FileDatas[]
  ErrorDatas: ErrorDatas[]
}
