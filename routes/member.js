const express = require("express");
const router = express.Router();

const memberController = require("../controller/member-controller");

router.post("/insertMember", memberController.postInsertMember);

router.post("/readMember", memberController.postReadMember);

router.post("/updateMember", memberController.postUpdateMember);

router.post("/readSpecificPhoto", memberController.postReadSpecificPhoto);

router.get("/imgStorage", memberController.getImgStorage);

router.post("/createPhoto", memberController.postCreatePhoto);

router.post("/deletePhoto", memberController.postDeletePhoto);

module.exports = router;
