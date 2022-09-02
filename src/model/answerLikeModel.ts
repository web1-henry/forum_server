import seq from '../db/seq'
import User from './userModel'
import Answer from './answerModel'
import { DataTypes } from 'sequelize'

//点赞数据表定义
const Like = seq.define('forum_answer_likes', {
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
  answerid: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue:'',
    comment: '回答id ',
  },
  isLike: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    comment: '是否已经点赞',
  },
})

User.hasMany(Like, { foreignKey: 'userid' })
Like.belongsTo(User, { foreignKey: 'userid' })
Answer.hasMany(Like, { foreignKey: 'answerid' })
Like.belongsTo(Answer, { foreignKey: 'answerid' })


Like.sync()

export default Like
