const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();
let RDS_DB_USER_NAME = process.env.RDS_DB_USER_NAME;
let RDS_DB_USER_PASSWORD = process.env.RDS_DB_USER_PASSWORD;

let connection = mysql.createPool({
  connectionLimit: 20,
  host: "cococal-mysql.cxpazwtm0zdn.ap-northeast-3.rds.amazonaws.com",
  user: RDS_DB_USER_NAME,
  password: RDS_DB_USER_PASSWORD,
  database: "CococalDB",
});

connection.getConnection((err) => {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = connection;
