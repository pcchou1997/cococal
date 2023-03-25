const express = require("express");
const router = express.Router();
const eventController = require("../controller/event-controller");

router
  .route("/api/event")
  .post(eventController.insertEvent)
  .get(eventController.readEvent)
  .patch(eventController.updateEvent)
  .delete(eventController.deleteEvent);

router
  .route("/api/event/:categoryColor")
  .get(eventController.readEventsOfSpecificCategory)
  .patch(eventController.updateEventsCategory);

router.route("/api/event/search").post(eventController.searchEvent);

router.route("/api/readSpecificEvent").post(eventController.readSpecificEvent);

module.exports = router;
