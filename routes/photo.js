const express = require("express");
const router = express.Router();
const photoController = require("../controller/photo-controller");

router
  .route("/api/photo")
  .post(photoController.insertPhoto)
  .delete(photoController.deletePhoto);

router.route("/api/photo/:email").get(photoController.readPhoto);

router.get("/api/securePhotoURL", photoController.getSecurePhotoURL);

module.exports = router;
