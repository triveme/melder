const { jwtAuth } = require("../middleware");
const { storeImage } = require("../middleware");
const controller = require("../controllers/climate_project.controller");
const express = require("express");
const climateProjectRouter = express.Router();

climateProjectRouter
  .get("/", [jwtAuth.verifyTokenAndGetPermissionsSoft], controller.getClimateProjects)
  .post("/", [jwtAuth.verifyTokenAndGetPermissionsHard], [storeImage.array("file", 3)], controller.postClimateProject)
  .put(
    "/:id",
    [jwtAuth.verifyTokenAndGetPermissionsHard],
    [storeImage.array("file", 3)],
    controller.updateClimateProject,
  )
  .delete("/:id", [jwtAuth.verifyTokenAndGetPermissionsHard], controller.deleteClimateProject);

module.exports = climateProjectRouter;
