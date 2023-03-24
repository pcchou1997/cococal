const express = require("express");
const cookieParser = require("cookie-parser");
const router = express.Router();
const adminController = require("../controller/admin-controller");

router.use(cookieParser());

router
  .route("/api/user/auth")
  .post(adminController.login)
  .get(adminController.getUser)
  .delete(adminController.logout);

router
  .route("/api/user")
  .patch(adminController.updateUser)
  .post(adminController.insertUser);

module.exports = router;
