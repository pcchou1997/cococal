const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const adminController = require("../controller/admin-controller");

router.use(cookieParser());

router.get("/", adminController.getIndexPage);

router.get("/shared-calendar", adminController.getSharedCalendarPage);

router.post("/login", adminController.postLogin);

router.get("/user", adminController.getUser);

router.get("/logout", adminController.getLogout);

module.exports = router;
