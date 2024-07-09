const { storeImage } = require("../middleware");
const { jwtAuth } = require("../middleware");
const controller = require("../controllers/report.controller");
const express = require("express");
const defectRouter = express.Router();
const xmlParser = require("express-xml-bodyparser");

const fileSizeLimitErrorHandler = (err, req, res, next) => {
  if (err) {
    res.status(400).send({
      message: "Fehler: Bilder sind zu groß",
    });
  } else {
    next();
  }
};

defectRouter
  .get("/", [jwtAuth.verifyTokenAndGetPermissionsHard], controller.getDefects)
  .get("/count", [jwtAuth.verifyTokenAndGetPermissionsHard], controller.getAmountOfDefects)
  .post("/", storeImage.array("file", 3), fileSizeLimitErrorHandler, controller.reportDefect);

defectRouter.post(
  "/external",
  [jwtAuth.verifyTokenAndGetPermissionsHard],
  xmlParser({ trim: false, explicitArray: false }),
  controller.reportDefectExternal,
);

module.exports = defectRouter;
