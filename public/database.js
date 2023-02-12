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

// Insert event

async function insertEvent(
  title,
  startDate,
  startTime,
  endDate,
  endTime,
  allDay,
  color
) {
  let sql =
    "INSERT INTO calendarEvents (title, startDate,startTime,endDate,endTime,allDay,color) VALUES ?";
  // (?,?)
  let values = [[title, startDate, startTime, endDate, endTime, allDay, color]];
  connection.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("insert new event");
    return "insert new event";
  });
}

// Read All Event

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

// Read specific Event

async function readSpecificEvent(title, startDate, startTime) {
  console.log("Hi");
  let sql =
    "SELECT * FROM calendarEvents WHERE title = ? AND startDate = ? AND startTime = ?";
  let values = [title, startDate, startTime];
  let data = await new Promise((resolve, reject) => {
    connection.query(sql, values, function (err, result) {
      if (err) throw err;
      else {
        return resolve(result);
      }
    });
  });
  return data;
}

// Update event

async function updateEvent(
  title,
  startDate,
  startTime,
  endDate,
  endTime,
  allDay,
  color,
  oldTitle,
  oldStartDate,
  oldStartTime
) {
  let sql =
    "UPDATE calendarEvents SET title=?,startDate=?,startTime=?, endDate=?,endTime=?,allDay=?,color=? WHERE title=? and startDate=? and startTime=?";
  let values = [
    title,
    startDate,
    startTime,
    endDate,
    endTime,
    allDay,
    color,
    oldTitle,
    oldStartDate,
    oldStartTime,
  ];
  let data = await new Promise((resolve, reject) => {
    connection.query(sql, values, function (err, result) {
      if (err) throw err;
      else {
        return resolve(result);
      }
    });
  });
  return data;
}

// Delete event
async function deleteEvent(oldTitle, oldStartDate, oldStartTime) {
  let sql =
    "DELETE FROM calendarEvents WHERE title=? and startDate=? and startTime=?";
  let values = [oldTitle, oldStartDate, oldStartTime];
  let data = await new Promise((resolve, reject) => {
    connection.query(sql, values, function (err, result) {
      if (err) throw err;
      else {
        return resolve(result);
      }
    });
  });
  return data;
}

// Add Category
async function insertCategory(categoryName, color) {
  let sql = "INSERT INTO categories (categoryName,color) VALUES ?";
  let values = [[categoryName, color]];
  let data = await new Promise((resolve, reject) => {
    connection.query(sql, [values], function (err, result) {
      if (err) throw err;
      else {
        return resolve(result);
      }
    });
  });
  return data;
}

module.exports = {
  insertEvent,
  readEvent,
  readSpecificEvent,
  updateEvent,
  deleteEvent,
  insertCategory,
};
