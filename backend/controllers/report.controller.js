const db = require("../db/models");
const Report = db.report;
const Defect = db.defect;
const { ensurePermission } = require("../utils/ensure-permission");

const fs = require("fs");
const crypto = require("crypto");
const { promisify } = require("util");
const { Op } = require("sequelize");
const { sendMail } = require("../services/mail.service");
const unlinkAsync = promisify(fs.unlink);
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const algorithm = "aes-256-cbc";

const counties = [
  "Dammersbach",
  "Großenbach",
  "Hünfeld",
  "Kirchhasel",
  "Mackenzell",
  "Malges",
  "Michelsrombach",
  "Molzbach",
  "Nüst",
  "Oberfeld",
  "Oberrombach",
  "Roßbach",
  "Rückers",
  "Rudolphshan",
  "Sargenzell",
];

exports.getReports = async (req, res) => {
  let isBackOfficeRequest = false;
  if (Object.values(req.query).includes("all")) {
    isBackOfficeRequest = true;
  }

  if ((!req.query.status || !req.query.category) && !isBackOfficeRequest) {
    console.log("Incoming request has too few query params to get reports.");
    res.status(200).send([]);
    return;
  }

  let queryParams = createQueryParams(req);

  const isReportAdmin = req.permissions === "all" || req.permissions.includes("melder_perm");

  if (isReportAdmin) {
    Report.findAll(queryParams)
      .then((reportData) => {
        res.status(200).send(reportData);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Beim Abrufen der Meldungen ist ein Fehler aufgetreten",
        });
      });
    return;
  }

  // get report data suitable for the public
  queryParams.attributes = [
    "id",
    "location",
    "category",
    "comment",
    "county",
    "description",
    "startDate",
    "endDate",
    "imgPath",
    "status",
    "redirection",
    "title",
    "link",
    "constructionCosts",
    "contactPerson",
  ];

  if (queryParams.where == undefined) {
    queryParams.where = {};
  }
  queryParams.where.status = "active";

  Report.findAll(queryParams)
    .then((reportDataActive) => {
      res.status(200).send(reportDataActive);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Beim Abrufen der aktiven, öffentlichen Meldungen ist ein Fehler aufgetreten",
      });
    });
};

exports.postReport = async (req, res) => {
  if (!ensurePermission(req, res, "melder_perm")) {
    return; // Return early if permissions are not sufficient
  }

  if (
    !req.body.location ||
    !req.body.category ||
    !req.body.description ||
    !req.body.startDate ||
    !req.body.endDate ||
    !req.body.county ||
    !req.body.title
  ) {
    res.status(400).send({
      message: "Fehlende(r) Parameter",
    });
    return;
  }

  let imagePaths = [];

  if (req.files && req.files.length > 0) {
    req.files.forEach((image) => {
      if (image.filename) {
        imagePaths.push(process.env.IMAGE_DIR + "/" + image.filename);
      }
    });
  }

  const report = {
    location: JSON.parse(req.body.location),
    category: req.body.category,
    county: req.body.county,
    comment: req.body.comment ? req.body.comment : "",
    adminComment: req.body.adminComment ? req.body.adminComment : "",
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    imgPath: imagePaths,
    status: "hidden",
    lastModifiedBy: null,
    address: req.body.address ? req.body.address : "",
    redirection: req.body.redirection ? JSON.parse(req.body.redirection) : [],
    title: req.body.title,
    link: req.body.link ? req.body.link : "",
    contactPerson: req.body.contactPerson ? req.body.contactPerson : "",
    constructionCosts: req.body.constructionCosts ? req.body.constructionCosts : "",
  };
  Report.create(report)
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Während der Erzeugung der Meldung ist ein Datenbankfehler aufgetreten",
      });
    });
};

exports.updateReport = async (req, res) => {
  if (!ensurePermission(req, res, "melder_perm")) {
    return; // Return early if permissions are not sufficient
  }

  if (!req.params.reportId) {
    res.status(400).send({
      message: "Fehlende reportId",
    });
    return;
  }

  const report = await Report.findByPk(req.params.reportId);
  if (!report) {
    res.status(400).send({
      message: "Meldung wurde nicht gefunden",
    });
    return;
  }

  let updateFields = req.body;

  //decode image paths
  let removedImages = [];
  if (req.body.removedImage) {
    removedImages = JSON.parse(req.body.removedImage);
  }

  //remove image paths in DB
  if (removedImages.length > 0) {
    let newImgPaths = [...report.imgPath];
    removedImages.forEach((imagePath) => {
      const index = newImgPaths.indexOf(imagePath);
      if (index !== -1 && newImgPaths.length > index) {
        newImgPaths.splice(index, 1);
      }
    });
    updateFields = { ...updateFields, imgPath: newImgPaths };
  }

  //remove image-files
  if (removedImages.length > 0) {
    for (const imagePath of removedImages) {
      try {
        await unlinkAsync(__basedir + imagePath);
      } catch (err) {
        console.log(err);
        res.status(400).send({
          message: "Beim Löschen des Meldungsbilds ist ein Fehler aufgetreten",
        });
        return;
      }
    }
  }

  //add new images to DB
  if (req.files && req.files.length > 0) {
    let imagePaths = [];
    req.files.forEach((image) => {
      if (image.filename) {
        imagePaths.push(process.env.IMAGE_DIR + "/" + image.filename);
      }
    });
    if (updateFields.imgPath) {
      updateFields = {
        ...updateFields,
        imgPath: [...updateFields.imgPath, ...imagePaths],
      };
    } else {
      updateFields = {
        ...updateFields,
        imgPath: [...report.imgPath, ...imagePaths],
      };
    }
  }

  if (updateFields.location) {
    updateFields = {
      ...updateFields,
      location: JSON.parse(updateFields.location),
    };
  }

  if (updateFields.redirection) {
    updateFields = {
      ...updateFields,
      redirection: JSON.parse(updateFields.redirection),
    };
  }

  report
    .update(updateFields)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "Inkorrekte Meldungsdaten, die Aktualisierung funktioniert nicht",
      });
    });
};

exports.deleteReport = async (req, res) => {
  if (!ensurePermission(req, res, "melder_perm")) {
    return; // Return early if permissions are not sufficient
  }

  if (!req.params.reportId) {
    res.status(400).send({
      message: "Fehlende reportId",
    });
    return;
  }

  const report = await Report.findByPk(req.params.reportId);
  if (!report) {
    res.status(400).send({
      message: "Meldung wurde nicht gefunden",
    });
    return;
  }

  if (report.imgPath && report.imgPath.length > 0) {
    for (const imagePath of report.imgPath) {
      try {
        await unlinkAsync(__basedir + imagePath);
      } catch (err) {
        console.log(err);
        res.status(400).send({
          message: "Beim Löschen des Meldungsbilds ist ein Fehler aufgetreten",
        });
        return;
      }
    }
  }

  report
    .destroy()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "Während des Löschens der Meldung ist ein Datenbankfehler aufgetreten",
      });
    });
};

exports.getAmountOfDefects = async (req, res) => {
  if (!ensurePermission(req, res, "maengel_perm")) {
    return; // Return early if permissions are not sufficient
  }

  Defect.count()
    .then((count) => {
      res.status(200).send({ count: count });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Beim Abrufen der Mängel ist ein Fehler aufgetreten",
      });
    });
  return;
};

exports.getDefects = async (req, res) => {
  if (!ensurePermission(req, res, "maengel_perm")) {
    return; // Return early if permissions are not sufficient
  }

  Defect.findAll({ raw: true, limit: 10, offset: parseInt(req.query.offset) || 0 })
    .then((defectData) => {
      defectData = defectData.map((defect) => {
        if (defect.mail) {
          try {
            const decipher = crypto.createDecipher(algorithm, process.env.SECRET);
            const mail = decipher.update(defect.mail, "hex", "utf-8") + decipher.final("utf8");
            defect.mail = mail;
          } catch (error) {
            console.log("Can't decrypt mail. Returning encrypted mail.");
          }
        }
        if (defect.phone) {
          try {
            const decipher = crypto.createDecipher(algorithm, process.env.SECRET);
            const phone = decipher.update(defect.phone, "hex", "utf-8") + decipher.final("utf8");
            defect.phone = phone;
          } catch (error) {
            console.log("Can't dectrypt phone. Returning encrypted phone.");
          }
        }
        return defect;
      });
      res.status(200).send(defectData);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Beim Abrufen der Mängel ist ein Fehler aufgetreten",
      });
    });
  return;
};

exports.reportDefect = async (req, res) => {
  console.log("Reporting Defect");
  if (!req.body.email || !req.body.category || !req.body.description || !req.body.location) {
    res.status(400).send({ message: "Invalid request body" });
    return;
  }

  let imagePaths = [];

  if (req.files && req.files.length > 0) {
    req.files.forEach((image) => {
      if (image.filename) {
        console.log("Adding image: ", image.filename);
        imagePaths.push(process.env.IMAGE_DIR + "/" + image.filename);
      }
    });
  }

  const cipher1 = crypto.createCipher(algorithm, process.env.SECRET);
  const cipher2 = crypto.createCipher(algorithm, process.env.SECRET);

  const defect = {
    location: JSON.parse(req.body.location),
    category: req.body.category,
    description: req.body.description,
    mail: cipher1.update(req.body.email || "", "utf-8", "hex") + cipher1.final("hex"),
    phone: cipher2.update(req.body.phone_no || "", "utf-8", "hex") + cipher2.final("hex"),
    imgPath: imagePaths,
  };

  Defect.create(defect)
    .then(async (defectData) => {
      const mailResponse = await sendMail(req.body, req.files).catch((err) => err);

      if (mailResponse instanceof Error) {
        console.log("500 error sending mail");
        console.log(mailResponse.message);
        res.status(500).send({ message: mailResponse.message });
      } else {
        console.log("201 success sending mail");
        console.log(defectData);
        res.status(201).send(defectData);
      }
    })
    .catch((err) => {
      console.error("Error during Defect Creation");
      console.error(err);
      res.status(500).send({
        message: err.message || "Während der Erzeugung der Meldung ist ein Datenbankfehler aufgetreten",
      });
    });
};

exports.reportDefectExternal = async (req, res) => {
  if (!ensurePermission(req, res, "maengel_perm")) {
    return; // Return early if permissions are not sufficient
  }

  if (req.body.meldung != undefined && req.body.meldung.sachdaten != undefined) {
    let defect = req.body.meldung.sachdaten;
    let defectImage = req.body.meldung.anhaenge;

    var location = [];
    var imagePaths = [];
    var address = {
      county: "Hünfeld",
      display_address: "Hünfeld",
    };

    if (defect.geom != undefined && defect.geom != "") {
      var geomPrefix = "POINT(";
      var geom = defect.geom.substring(geomPrefix.length, defect.geom.length - 2);
      var geomArray = geom.split(" ");

      location.push({
        lat: geomArray[0],
        lng: geomArray[1],
      });

      address = await createAddressForExternalDataset(location);

      if (!counties.includes(address.county)) {
        res.status(400).send({ message: "invalid coordinates detected." });
        return;
      }
    }

    if (defectImage.anhang.length > 0) {
      var fileBasePath = __basedir + process.env.IMAGE_DIR;

      defectImage.anhang.forEach((image) => {
        var img = image.$;
        var filePath = `${fileBasePath}/${uuidv4()}-infopin.${img.mime_typ.substring(6)}`;

        const binaryData = Buffer.from(img.base64_inhalt, "base64");
        fs.writeFile(filePath, binaryData, (error) => {
          if (error) {
            console.error(error);
          }
        });
      });
    }

    const report = {
      location: location,
      category: "Sonstiges",
      address: address.county,
      comment: defect.mitteilung ? defect.mitteilung : "",
      description: defect.mitteilung ? defect.mitteilung : "",
      imgPath: imagePaths,
      status: "hidden",
      lastModifiedBy: null,
      address: address.display_address,
      title: defect.ereignisart,
      contactPerson:
        defect.anrede && defect.vorname && defect.nachname
          ? `${defect.anrede} ${defect.vorname} && ${defect.nachname}`
          : "",
      guid: defect.guid,
    };

    Report.create(report)
      .then((data) => {
        res.status(201).send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Während der Erzeugung der Meldung ist ein Datenbankfehler aufgetreten",
        });
      });
    return;
  }

  res.status(400).send({ message: "no valid body found" });
};

async function createAddressForExternalDataset(coordinates) {
  var nominatimUrl = `https://nominatim.openstreetmap.org/search.php?q=${coordinates[0].lat},${coordinates[0].lng}&polygon_geojson=1&format=jsonv2`;

  var address = {
    county: "Hünfeld",
    display_address: "Hünfeld",
  };

  var resp = await axios.get(nominatimUrl).catch((err) => {
    console.log(err);
  });

  var data = resp.data[0];
  var address_parts = data.display_name.split(", ");

  address.county = address_parts[2];
  address.display_address = data.display_name;

  return address;
}

function createQueryParams(req) {
  queryParams = {};
  queryParams.where = {};

  const dateQuery = [];
  if (req.query.status && req.query.status !== "all") {
    if (req.query.status === "archiv") {
      dateQuery.push({
        [Op.and]: [{ startDate: { [Op.lt]: new Date() } }, { endDate: { [Op.lt]: new Date() } }],
      });
    } else if (req.query.status === "aktiv") {
      dateQuery.push({
        [Op.and]: [{ startDate: { [Op.lte]: new Date() } }, { endDate: { [Op.gte]: new Date() } }],
      });
    } else if (req.query.status === "geplant") {
      dateQuery.push({
        [Op.and]: [{ startDate: { [Op.gt]: new Date() } }, { endDate: { [Op.gt]: new Date() } }],
      });
    } else if (Array.isArray(req.query.status)) {
      req.query.status.forEach((status) => {
        if (status === "archiv") {
          dateQuery.push({
            [Op.and]: [{ startDate: { [Op.lt]: new Date() } }, { endDate: { [Op.lt]: new Date() } }],
          });
        } else if (status === "aktiv") {
          dateQuery.push({
            [Op.and]: [{ startDate: { [Op.lte]: new Date() } }, { endDate: { [Op.gte]: new Date() } }],
          });
        } else if (status === "geplant") {
          dateQuery.push({
            [Op.and]: [{ startDate: { [Op.gt]: new Date() } }, { endDate: { [Op.gt]: new Date() } }],
          });
        }
      });
    }

    queryParams.where = {
      [Op.or]: dateQuery,
    };
  }

  if (req.query.category && req.query.category !== "all") {
    queryParams.where.category = req.query.category;
  }

  return queryParams;
}
