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

async function insertEvent(title, startDate, startTime, endDate, endTime) {
  // 新增行程
  let sql =
    "INSERT INTO calendarEvents (title, startDate,startTime,endDate,endTime) VALUES ?";
  // (?,?)
  let values = [[title, startDate, startTime, endDate, endTime]];
  connection.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("insert new event");
    return "insert new event";
  });
}

// 查詢行程
async function readEvent() {
  let sql = "SELECT * FROM calendarEvents";
  let data = await new Promise((resolve, reject) => {
    connection.query(sql, function (err, result) {
      if (err) throw err;
      // console.log(result);
      else {
        return resolve(result);
      }
    });
  });
  return data;
}

module.exports = { insertEvent, readEvent };
