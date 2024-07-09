const { jwtAuth } = require("../middleware");
const controller = require("../controllers/sensor.controller");
const express = require("express");
const sensorRouter = express.Router();

sensorRouter.get(
  "/glass-container-levels",
  [jwtAuth.verifyTokenAndGetPermissionsHard],
  controller.getLevelsOfGlassContainers,
);

module.exports = sensorRouter;
