const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category-controller");

router
  .route("/api/category")
  .post(categoryController.insertCategory)
  .get(categoryController.readCategory)
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

router
  .route("/api/category/:categoryName")
  .get(categoryController.readSpecificCategory);

module.exports = router;
