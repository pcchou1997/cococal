const db = require("../database");

exports.insertUser = async function (name, email, password) {
  let sql = "INSERT INTO members (name, email, password) VALUES ?";
  let values = [[name, email, password]];
  let data = await new Promise((resolve, reject) => {
    db.query(sql, [values], function (err, result) {
      if (err) throw err;
      else {
        return resolve(result);
      }
    });
  });
  return data;
};

exports.readUser = async function (email, password) {
  let sql = "SELECT * FROM members WHERE email = ? AND password = ?";
  let values = [email, password];
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

exports.updateUser = async function (name, oldName, email) {
  let sql = "UPDATE members SET name=? WHERE name=? and email=?";
  let values = [name, oldName, email];
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
