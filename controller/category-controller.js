const categoryModel = require("../model/category-model");

exports.insertCategory = async (req, res) => {
  try {
    let data = req.body;
    const categoryName = data.categoryName;
    const color = data.color;

    if (categoryName == "" || color == "") {
      res.status(400).json({ error: true, message: "Wrong request data" });
    } else {
      const result = await categoryModel.insertCategory(categoryName, color);
      if (result.constructor.name == "OkPacket") {
        res.status(200).json({ ok: true, data: result });
      } else {
        res.status(400).json({ error: true, message: "Fail to insert data" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

exports.readCategory = async (req, res) => {
  try {
    const result = await categoryModel.readCategory();
    res.status(200).json({ ok: true, data: result });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    let data = req.body;
    const categoryName = data.categoryName;
    const color = data.color;
    const oldCategoryName = data.oldCategoryName;
    const oldColor = data.oldColor;
    if (
      categoryName == "" ||
      color == "" ||
      oldCategoryName == "" ||
      oldColor == ""
    ) {
      res.status(400).json({ error: true, message: "Wrong request data" });
    } else {
      const result = await categoryModel.updateCategory(
        categoryName,
        color,
        oldCategoryName,
        oldColor
      );
      if (result.constructor.name == "OkPacket") {
        res.status(200).json({ ok: true, data: result });
      } else {
        res.status(400).json({ error: true, message: "Fail to update data" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    let data = req.body;
    const categoryName = data.categoryName;
    const color = data.color;
    if (categoryName == "" || color == "") {
      res.status(400).json({ error: true, message: "Wrong request data" });
    } else {
      const result = await categoryModel.deleteCategory(categoryName, color);
      if (result.constructor.name == "OkPacket") {
        res.status(200).json({ ok: true, data: result });
      } else {
        res.status(400).json({ error: true, message: "Fail to delete data" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

exports.readSpecificCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    if (categoryName == "") {
      res.status(400).json({ error: true, message: "Wrong request data" });
    } else {
      const result = await categoryModel.readSpecificCategory(categoryName);
      res.status(200).json({ ok: true, data: result });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};
