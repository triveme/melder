const { storeImage } = require("../middleware");
const { jwtAuth } = require("../middleware");
const controller = require("../controllers/report.controller");
var express = require("express");
var defectRouter = express.Router();
var xmlParser = require("express-xml-bodyparser");

const fileSizeLimitErrorHandler = (err, req, res, next) => {
  if (err) {    
    res.status(400).send({
      message: "Fehler: Bilder sind zu groß",
    });
  } else {
    next()
  }
}

defectRouter.post("/", storeImage.array("file", 3),fileSizeLimitErrorHandler, controller.reportDefect);

defectRouter.post(
  "/external",
  [jwtAuth.verifyToken],
  xmlParser({ trim: false, explicitArray: false }),
  controller.reportDefectExternal
);

module.exports = defectRouter;
