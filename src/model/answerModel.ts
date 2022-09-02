import {DataTypes} from 'sequelize'
import seq from '../db/seq'
import Question from './questionModel'
import User from './userModel'

//回答数据表定义
const Answer = seq.define("forum_answer",{
    _id:{
        allowNull:false,
        type:DataTypes.STRING,
        primaryKey:true,
        comment:"回答id,唯一"
    },
    content:{
        allowNull:false,
        type:DataTypes.TEXT('long'),
        comment:"回答内容"
    },
    likes:{
        type:DataTypes.BIGINT,
        defaultValue:0,
        comment:"点赞数"
    },
    questionid:{
        allowNull:false,
        type:DataTypes.STRING,
        comment:"对应问题id"
    },
    userid:{
        allowNull:false,
        type:DataTypes.STRING,
        comment:"回答者id"
    },
    deleted:{
        type:DataTypes.SMALLINT,
        defaultValue:0,
        comment:"是否被删除"
    }
})

User.hasMany(Answer,{foreignKey:'userid'})
Answer.belongsTo(User,{foreignKey:'userid'})
Question.hasMany(Answer,{foreignKey:'questionid'})
Answer.belongsTo(Question,{foreignKey:'questionid'})

Answer.sync()

export default Answer
