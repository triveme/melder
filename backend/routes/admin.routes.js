const { jwtAuth } = require("../middleware");
const controller = require("../controllers/admin.controller");
const express = require("express");
const adminRouter = express.Router();

adminRouter
  .get("/", [jwtAuth.verifyTokenAndGetPermissionsHard], controller.getAdmins)
  .post("/", [jwtAuth.verifyTokenAndGetPermissionsHard], controller.postAdmin)
  .put("/:adminId", [jwtAuth.verifyTokenAndGetPermissionsHard], controller.updateAdmin)
  .delete("/:adminId", [jwtAuth.verifyTokenAndGetPermissionsHard], controller.deleteAdmin);

module.exports = adminRouter;
