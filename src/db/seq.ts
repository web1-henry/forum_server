import { Sequelize } from "sequelize";
import CONFIG from "../config/default";

const seq = new Sequelize(CONFIG.MYSQL_DB, CONFIG.MYSQL_USER, CONFIG.MYSQL_PWD, {
  host: CONFIG.MYSQL_HOST,
  dialect: "mysql"
});

export default seq