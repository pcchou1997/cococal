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
  color,
  className,
  description
) {
  let sql =
    "INSERT INTO calendarEvents (title, startDate,startTime,endDate,endTime,allDay,color,className,description) VALUES ?";
  // (?,?)
  let values = [
    [
      title,
      startDate,
      startTime,
      endDate,
      endTime,
      allDay,
      color,
      className,
      description,
    ],
  ];
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
      else {
        return resolve(result);
      }
    });
  });
  return data;
}

// Read specific Event

async function readSpecificEvent(title, startDate, startTime) {
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

// Read Events of specific Category

async function readEventsOfSpecificCategory(oldColor) {
  let sql = "SELECT * FROM calendarEvents WHERE color = ?";
  let values = [oldColor];
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
  className,
  description,
  oldTitle,
  oldStartDate,
  oldStartTime
) {
  let sql =
    "UPDATE calendarEvents SET title=?,startDate=?,startTime=?, endDate=?,endTime=?,allDay=?,color=?,className=?,description=? WHERE title=? and startDate=? and startTime=?";
  let values = [
    title,
    startDate,
    startTime,
    endDate,
    endTime,
    allDay,
    color,
    className,
    description,
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

// Update event category

async function updateEventCategory(color, className, oldColor, oldClassName) {
  let sql =
    "UPDATE calendarEvents SET color=?, className=? WHERE color=? and className=?";
  let values = [color, className, oldColor, oldClassName];
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

// Insert Category

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

// Read All Categories

async function readCategory() {
  let sql = "SELECT * FROM categories";
  let data = await new Promise((resolve, reject) => {
    connection.query(sql, function (err, result) {
      if (err) throw err;
      else {
        return resolve(result);
      }
    });
  });
  return data;
}

// Read specific Category

async function readSpecificCategory(color) {
  let sql = "SELECT * FROM categories WHERE color=?";
  let values = [color];
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

// Update Category

async function updateCategory(categoryName, color, oldCategoryName, oldColor) {
  let sql =
    "UPDATE categories SET categoryName=?,color=? WHERE categoryName=? and color=?";
  let values = [categoryName, color, oldCategoryName, oldColor];
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

// Delete Category

async function deleteCategory(categoryName, color) {
  let sql = "DELETE FROM categories WHERE categoryName=? and color=?";
  let values = [categoryName, color];
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

// search event

async function searchEvent(keyword) {
  let sql = "SELECT * FROM calendarEvents WHERE title REGEXP ?;";
  let values = [keyword];
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

// Insert member

async function insertMember(name, email, password) {
  let sql = "INSERT INTO members (name, email, password) VALUES ?";
  let values = [[name, email, password]];
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

// Read member

async function readMember(email, password) {
  let sql = "SELECT * FROM members WHERE email = ? AND password = ?";
  let values = [email, password];
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

module.exports = {
  insertEvent,
  readEvent,
  readSpecificEvent,
  readEventsOfSpecificCategory,
  updateEvent,
  updateEventCategory,
  deleteEvent,
  insertCategory,
  readCategory,
  readSpecificCategory,
  updateCategory,
  deleteCategory,
  searchEvent,
  insertMember,
  readMember,
};
