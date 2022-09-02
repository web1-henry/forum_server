import seq from '../db/seq'
import { DataTypes } from 'sequelize'

const LoginState = seq.define('forum_login_state', {
  username: {
    allowNull: false,
    type: DataTypes.STRING,
    primaryKey: true,
    comment: '用户token',
  },
  state: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    comment: '登录状态',
  },
})

LoginState.sync()

export default LoginState
