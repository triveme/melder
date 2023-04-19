var express = require("express");
var apiRouter = express.Router();
var adminRouter = require("./admin.routes");
var reportRouter = require("./report.routes");
var authRouter = require("./auth.routes");
var defectRouter = require("./defect.routes");

apiRouter.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

apiRouter.use("/admins", adminRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/reports", reportRouter);
apiRouter.use("/defects", defectRouter);

module.exports = apiRouter;
