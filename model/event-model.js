const db = require("../database");

exports.insertEvent = async function (
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
  db.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("insert new event");
    return "insert new event";
  });
};

exports.readEvent = async function () {
  let sql = "SELECT * FROM calendarEvents";
  let data = await new Promise((resolve, reject) => {
    db.query(sql, function (err, result) {
      if (err) throw err;
      else {
        return resolve(result);
      }
    });
  });
  return data;
};

exports.readSpecificEvent = async function (title, startDate, startTime) {
  let sql =
    "SELECT * FROM calendarEvents WHERE title = ? AND startDate = ? AND startTime = ?";
  let values = [title, startDate, startTime];
  let data = await new Promise((resolve, reject) => {
    db.query(sql, values, function (err, result) {
      if (err) throw err;
      else {
        return resolve(result);
      }
    });
  });
  return data;
};

exports.readEventsOfSpecificCategory = async function (oldColor) {
  let sql = "SELECT * FROM calendarEvents WHERE color = ?";
  let values = [oldColor];
  let data = await new Promise((resolve, reject) => {
    db.query(sql, values, function (err, result) {
      if (err) throw err;
      else {
        return resolve(result);
      }
    });
  });
  return data;
};

exports.updateEvent = async function (
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
    db.query(sql, values, function (err, result) {
      if (err) throw err;
      else {
        return resolve(result);
      }
    });
  });
  return data;
};

exports.updateEventCategory = async function (
  color,
  className,
  oldColor,
  oldClassName
) {
  let sql =
    "UPDATE calendarEvents SET color=?, className=? WHERE color=? and className=?";
  let values = [color, className, oldColor, oldClassName];
  let data = await new Promise((resolve, reject) => {
    db.query(sql, values, function (err, result) {
      if (err) throw err;
      else {
        return resolve(result);
      }
    });
  });
  return data;
};

exports.deleteEvent = async function (oldTitle, oldStartDate, oldStartTime) {
  let sql =
    "DELETE FROM calendarEvents WHERE title=? and startDate=? and startTime=?";
  let values = [oldTitle, oldStartDate, oldStartTime];
  let data = await new Promise((resolve, reject) => {
    db.query(sql, values, function (err, result) {
      if (err) throw err;
      else {
        return resolve(result);
      }
    });
  });
  return data;
};

exports.searchEvent = async function (keyword) {
  let sql = "SELECT * FROM calendarEvents WHERE title REGEXP ?;";
  let values = [keyword];
  let data = await new Promise((resolve, reject) => {
    db.query(sql, values, function (err, result) {
      if (err) throw err;
      else {
        return resolve(result);
      }
    });
  });
  return data;
};
