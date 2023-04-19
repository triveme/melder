const { jwtAuth, verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
var express = require("express");
var authRouter = express.Router();

  authRouter.post(
    "/signup",
    [verifySignUp.checkDuplicateUsername, jwtAuth.verifyToken],
    controller.signup
  )
  .post("/signin", controller.signin);

  module.exports = authRouter;