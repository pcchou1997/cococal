const categoryModel = require("../model/category-model");

exports.postInsertCategory = async (req, res) => {
  let data = req.body;
  const categoryName = data.categoryName;
  const color = data.color;
  const result = await categoryModel.insertCategory(categoryName, color);
  res.send(result);
};

exports.getReadCategory = async (req, res) => {
  const result = await categoryModel.readCategory();
  res.json(result);
};

exports.postReadSpecificCategory = async (req, res) => {
  let data = req.body;
  const color = data.color;
  const result = await categoryModel.readSpecificCategory(color);
  res.send(result);
};

exports.postUpdateCategory = async (req, res) => {
  let data = req.body;
  const categoryName = data.categoryName;
  const color = data.color;
  const oldCategoryName = data.oldCategoryName;
  const oldColor = data.oldColor;
  const result = await categoryModel.updateCategory(
    categoryName,
    color,
    oldCategoryName,
    oldColor
  );
  res.send(result);
};

exports.postDeleteCategory = async (req, res) => {
  let data = req.body;
  const categoryName = data.categoryName;
  const color = data.color;
  const result = await categoryModel.deleteCategory(categoryName, color);
  res.send(result);
};
