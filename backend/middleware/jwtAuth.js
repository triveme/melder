require("dotenv").config();
const jwt = require("jsonwebtoken");
const db = require("../db/models");
const Admin = db.admin;

verifyTokenAndGetPermissionsHard = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "Es wurde kein Token übergeben" });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unautorisiert" });
    }

    async function getAdmin() {
      const admin = await Admin.findByPk(decoded.id);
      if (!admin) {
        throw new Error("Nutzer wurde nicht gefunden");
      }
      return admin;
    }

    getAdmin()
      .then((admin) => {
        const permissions = admin.permissions;
        if (!permissions || permissions === "") {
          req.permissions = "all";
        } else {
          req.permissions = permissions;
        }
        next();
      })
      .catch((err) => {
        return res.status(500).send({ message: err.message });
      });
  });
};

verifyTokenAndGetPermissionsSoft = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    req.permissions = "none";
    next();
  } else {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        req.permissions = "none";
        next();
      }

      async function getAdmin() {
        const admin = await Admin.findByPk(decoded.id);
        if (!admin) {
          req.permissions = "none";
          next();
        }
        return admin;
      }

      getAdmin().then((admin) => {
        const permissions = admin.permissions;
        if (!permissions || permissions === "") {
          req.permissions = "all";
        } else {
          req.permissions = permissions;
        }
        next();
      });
    });
  }
};

const jwtAuth = {
  verifyTokenAndGetPermissionsHard,
  verifyTokenAndGetPermissionsSoft,
};
module.exports = jwtAuth;
