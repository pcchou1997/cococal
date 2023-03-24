const express = require("express");
const router = express.Router();
const pageController = require("../controller/page-controller");

router.get("/", pageController.getIndexPage);

router.get("/shared-calendar", pageController.getSharedCalendarPage);

module.exports = router;
