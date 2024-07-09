require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db/models");
const Admin = db.admin;
const { ensurePermission } = require("../utils/ensure-permission");

exports.signup = async (req, res) => {
  if (!ensurePermission(req, res, "admin_perm")) {
    return; // Return early if permissions are not sufficient
  }

  try {
    const admin = await Admin.create({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10),
    });
    if (admin) {
      res.status(201).send({ message: "Nutzer wurde erfolgreich registriert" });
    } else {
      res.status(500).send({ message: "Registrierung des Nutzers ist fehlgeschlagen" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (!admin) {
      return res.status(404).send({ message: "Nutzer wurde nicht gefunden" });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, admin.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Falsches Passwort",
      });
    }

    const token = jwt.sign({ id: admin.id, permissions: admin.permissions }, process.env.SECRET, {
      expiresIn: 86400, // 24 hours
    });
    return res.status(200).send({
      accessToken: token,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
