import seq from '../db/seq'
import User from './userModel'
import Question from './questionModel'
import { DataTypes } from 'sequelize'

//点赞数据表定义
const Like = seq.define('forum_question_likes', {
  _id: {
    allowNull: false,
    type: DataTypes.STRING,
    primaryKey: true,
    comment: '点赞问题对应表id,唯一',
  },
  userid: {
    allowNull: false,
    type: DataTypes.STRING,
    comment: '点赞人id',
  },
  questionid: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue:'',
    comment: '问题id',
  },
  isLike: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    comment: '是否已经点赞',
  },
})

User.hasMany(Like, { foreignKey: 'userid' })
Like.belongsTo(User, { foreignKey: 'userid' })
Question.hasMany(Like, { foreignKey: 'questionid' })
Like.belongsTo(Question, { foreignKey: 'questionid' })


Like.sync()

export default Like
