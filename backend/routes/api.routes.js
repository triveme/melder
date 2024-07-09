const express = require("express");
const apiRouter = express.Router();
const adminRouter = require("./admin.routes");
const reportRouter = require("./report.routes");
const climateProjectRouter = require("./climate_project.routes");
const authRouter = require("./auth.routes");
const defectRouter = require("./defect.routes");
const sensorRouter = require("./sensor.routes");

apiRouter.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
  next();
});

apiRouter.use("/admins", adminRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/reports", reportRouter);
apiRouter.use("/climate-projects", climateProjectRouter);
apiRouter.use("/defects", defectRouter);
apiRouter.use("/sensors", sensorRouter);

module.exports = apiRouter;
