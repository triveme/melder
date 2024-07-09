const bcrypt = require("bcryptjs");
const db = require("../db/models");
const Admin = db.admin;
const { ensurePermission } = require("../utils/ensure-permission");

exports.getAdmins = async (req, res) => {
  if (!ensurePermission(req, res, "admin_perm")) {
    return; // Return early if permissions are not sufficient
  }

  const admins = await Admin.findAll({
    attributes: { exclude: ["password"] },
  });
  res.status(200).send(admins);
};

exports.postAdmin = async (req, res) => {
  if (!ensurePermission(req, res, "admin_perm")) {
    return; // Return early if permissions are not sufficient
  }

  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      message: "Fehlende(r) Parameter",
    });
    return;
  }

  if (req.body.password.length < 8) {
    res.status(400).send({
      message: "Passwort muss mindestens 8 Zeichen enthalten",
    });
    return;
  }

  const numberOfBlockingAdmins = await Admin.count({
    where: { username: req.body.username },
  });
  if (numberOfBlockingAdmins > 0) {
    res.status(400).send({
      message: "Nutzer mit diesem Nutzernamen existiert bereits",
    });
    return;
  }

  const admin = {
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
    permissions: req.body.permissions ? req.body.permissions : null,
  };
  Admin.create(admin)
    .then((data) => {
      res.status(201).send(data.username);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Während der Erzeugung des Nutzers ist ein Datenbankfehler aufgetreten",
      });
    });
};

exports.updateAdmin = async (req, res) => {
  if (!ensurePermission(req, res, "admin_perm")) {
    return; // Return early if permissions are not sufficient
  }

  if (!req.params.adminId || !req.body.username || !req.body.password) {
    res.status(400).send({
      message: "Fehlende(r) Parameter",
    });
    return;
  }

  const admin = await Admin.findByPk(req.params.adminId);
  if (!admin) {
    res.status(400).send({
      message: "Der Nutzer wurde nicht gefunden",
    });
    return;
  }

  if (req.body.password.length < 8) {
    res.status(400).send({
      message: "Passwort muss mindestens 8 Zeichen enthalten",
    });
    return;
  }

  admin
    .update({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10),
      permissions: req.body.permissions ? req.body.permissions : null,
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "Inkorrekte Nutzerdaten, die Aktualisierung funktioniert nicht",
      });
    });
};

exports.deleteAdmin = async (req, res) => {
  if (!ensurePermission(req, res, "admin_perm")) {
    return; // Return early if permissions are not sufficient
  }

  if (!req.params.adminId) {
    res.status(400).send({
      message: "Fehlende Id.",
    });
    return;
  }

  if (req.params.adminId === 1) {
    res.status(400).send({
      message: "Der Hauptadministrator kann nicht gelöscht werden",
    });
    return;
  }

  const admins = await Admin.findAll();
  if (admins.length < 2) {
    res.status(400).send({
      message: "Nutzer kann nicht gelöscht werden, da immer mindestens ein Nutzer existieren muss",
    });
    return;
  }

  const admin = await Admin.findByPk(req.params.adminId);
  if (!admin) {
    res.status(400).send({
      message: "Nutzer wurde nicht gefunden",
    });
    return;
  }

  admin
    .destroy()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Während des Löschens des Nutzers ist ein Datenbankfehler aufgetreten",
      });
    });
};
