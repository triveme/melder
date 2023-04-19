const { jwtAuth } = require("../middleware");
const controller = require("../controllers/admin.controller");
var express = require("express");
var adminRouter = express.Router();

   adminRouter.get("/", [jwtAuth.verifyToken], controller.getAdmins)
   .post("/", [jwtAuth.verifyToken], controller.postAdmin)
   .put(
    "/:adminId",
    [jwtAuth.verifyToken],
    controller.updateAdmin
  )
  .delete(
    "/:adminId",
    [jwtAuth.verifyToken],
    controller.deleteAdmin
  );

  module.exports = adminRouter;