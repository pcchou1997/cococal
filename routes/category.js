const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category-controller");

router.post("/insertCategory", categoryController.postInsertCategory);

router.get("/readCategory", categoryController.getReadCategory);

router.post(
  "/readSpecificCategory",
  categoryController.postReadSpecificCategory
);

router.post("/updateCategory", categoryController.postUpdateCategory);

router.post("/deleteCategory", categoryController.postDeleteCategory);

module.exports = router;
