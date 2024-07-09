const { jwtAuth, verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const express = require("express");
const authRouter = express.Router();

authRouter
  .post("/signup", [verifySignUp.checkDuplicateUsername, jwtAuth.verifyTokenAndGetPermissionsHard], controller.signup)
  .post("/signin", controller.signin);

module.exports = authRouter;
