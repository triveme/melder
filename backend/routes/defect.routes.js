const { storeImage } = require("../middleware");
const { jwtAuth } = require("../middleware");
const controller = require("../controllers/report.controller");
var express = require("express");
var defectRouter = express.Router();
var xmlParser = require("express-xml-bodyparser");

defectRouter.post("/", [storeImage.array("file", 3)], controller.reportDefect);

defectRouter.post(
  "/external",
  [jwtAuth.verifyToken],
  xmlParser({ trim: false, explicitArray: false }),
  controller.reportDefectExternal
);

module.exports = defectRouter;
