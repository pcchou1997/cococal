const db = require("../database");

exports.insertCategory = async function (categoryName, color) {
  let sql = "INSERT INTO categories (categoryName,color) VALUES ?";
  let values = [[categoryName, color]];
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

exports.readCategory = async function () {
  let sql = "SELECT * FROM categories";
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

exports.readSpecificCategory = async function (categoryName) {
  let sql = "SELECT * FROM categories WHERE categoryName=?";
  let values = [categoryName];
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

exports.updateCategory = async function (
  categoryName,
  color,
  oldCategoryName,
  oldColor
) {
  let sql =
    "UPDATE categories SET categoryName=?,color=? WHERE categoryName=? and color=?";
  let values = [categoryName, color, oldCategoryName, oldColor];
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

exports.deleteCategory = async function (categoryName, color) {
  let sql = "DELETE FROM categories WHERE categoryName=? and color=?";
  let values = [categoryName, color];
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
