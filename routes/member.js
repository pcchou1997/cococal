const express = require("express");
const router = express.Router();

const memberController = require("../controller/member-controller");

router.post("/readSpecificPhoto", memberController.postReadSpecificPhoto);

router.get("/imgStorage", memberController.getImgStorage);

router.post("/createPhoto", memberController.postCreatePhoto);

router.post("/deletePhoto", memberController.postDeletePhoto);

module.exports = router;
