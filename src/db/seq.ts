import { Sequelize } from 'sequelize'
import CONFIG from '../config/default'

//关联数据库
const seq = new Sequelize(
  CONFIG.MYSQL_DB,
  CONFIG.MYSQL_USER,
  CONFIG.MYSQL_PWD,
  {
    host: CONFIG.MYSQL_HOST,
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8',
    },
  },
)

export default seq
