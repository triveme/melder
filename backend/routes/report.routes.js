const { jwtAuth } = require("../middleware");
const { storeImage } = require("../middleware");
const controller = require("../controllers/report.controller");
const express = require("express");
const reportRouter = express.Router();

reportRouter
  .get("/", [jwtAuth.verifyTokenAndGetPermissionsSoft], controller.getReports)
  .post("/", [jwtAuth.verifyTokenAndGetPermissionsHard], [storeImage.array("file", 3)], controller.postReport)
  .put("/:reportId", [jwtAuth.verifyTokenAndGetPermissionsHard], [storeImage.array("file", 3)], controller.updateReport)
  .delete("/:reportId", [jwtAuth.verifyTokenAndGetPermissionsHard], controller.deleteReport);

module.exports = reportRouter;
