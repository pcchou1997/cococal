const express = require("express");
const router = express.Router();
const eventController = require("../controller/event-controller");

router.post("/insertEvent", eventController.postInsertEvent);

router.get("/readEvent", eventController.getReadEvent);

router.post("/readSpecificEvent", eventController.postReadSpecificEvent);

router.post(
  "/readEventsOfSpecificCategory",
  eventController.postReadEventsOfSpecificCategory
);

router.post("/updateEvent", eventController.postUpdateEvent);

router.post("/updateEventCategory", eventController.postUpdateEventCategory);

router.post("/deleteEvent", eventController.postDeleteEvent);

router.post("/searchEvent", eventController.postSearchEvent);

module.exports = router;
