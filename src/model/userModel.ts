import { DataTypes } from "sequelize";
import seq from "../db/seq";

//User数据表定义
const User = seq.define("forum_user", {
  _id: {
    allowNull: false,
    type:DataTypes.STRING,
    primaryKey:true,
    comment: "用户id,唯一"
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: "用户名"
  },
  admin: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: "用户身份,0表示普通用户，1表示管理员,2表示官方人员"
  },
  password: {
    type: DataTypes.CHAR(64),
    allowNull: false,
    comment: "密码"
  },
});

User.sync();

export default User
