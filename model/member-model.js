const db = require("../database");

exports.insertMember = async function (name, email, password) {
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

exports.readMember = async function (email, password) {
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

exports.updateMember = async function (name, oldName, email) {
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

exports.readSpecificPhoto = async function (email) {
  let sql = "SELECT * FROM photos WHERE email = ?";
  let values = [email];
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

exports.createPhoto = async function (email, image) {
  let sql = "INSERT INTO photos (email, image) VALUES ?";
  let values = [[email, image]];
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

exports.deletePhoto = async function (email) {
  let sql = "DELETE FROM photos WHERE email=?";
  let values = [email];
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
