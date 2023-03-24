const db = require("../database");

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
