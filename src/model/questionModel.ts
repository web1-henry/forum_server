import { DataTypes } from "sequelize";
import seq from "../db/seq";
import User from "./userModel";

//question数据表定义
const Question = seq.define("forum_question", {
    _id:{
        allowNull:false,
        type:DataTypes.STRING,
        primaryKey:true,
        comment:"问题id,唯一"
    },
    author: {
        allowNull:false,
        type:DataTypes.STRING,
        comment:"提问者"
    },
    title: {
        allowNull:false,
        type:DataTypes.TEXT('long'),
        comment:"问题标题"
    },
    content: {
        allowNull:false,
        type:DataTypes.TEXT('long'),
        comment:"提问内容"
    },
    views:{
        type:DataTypes.BIGINT,
        defaultValue:0,
        comment:"浏览数"
    },
    answers:{
        type:DataTypes.BIGINT,
        defaultValue:0,
        comment:"回答数"
    },
    likes:{
        type:DataTypes.BIGINT,
        defaultValue:0,
        comment:"点赞数"
    },
    deleted:{
        type:DataTypes.SMALLINT,
        defaultValue:false,
        comment:"是否被删除"
    }

})

User.hasMany(Question,{foreignKey:'author'})
Question.belongsTo(User,{foreignKey:'author'})
Question.sync()

export default Question