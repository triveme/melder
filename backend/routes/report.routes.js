const { jwtAuth } = require("../middleware");
const { storeImage } = require("../middleware");
const controller = require("../controllers/report.controller");
var express = require("express");
var reportRouter = express.Router();

// app.get("/api/reports", [jwtAuth.verifyToken], controller.getReports)

reportRouter
  .get("/", controller.getReports)
  .post(
    "/",
    [jwtAuth.verifyToken],
    [storeImage.array("file", 3)],
    controller.postReport
  )
  .put(
    "/:reportId",
    [jwtAuth.verifyToken],
    [storeImage.array("file", 3)],
    controller.updateReport
  )
  .delete("/:reportId", [jwtAuth.verifyToken], controller.deleteReport);

console.log(controller.reportDefect);

reportRouter.post(
  "/defects",
  [jwtAuth.verifyToken],
  [storeImage.array("file", 3)],
  controller.reportDefect
);

module.exports = reportRouter;
