const jwt = require("jsonwebtoken");
const db = require("../db/models");
const Report = db.report;

const fs = require("fs");
const { promisify } = require("util");
const { Op } = require("sequelize");
const { sendMail } = require("../services/mail.service");
const unlinkAsync = promisify(fs.unlink);
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

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

getIsAdmin = (req, res) => {
  let token = req.headers["x-access-token"];
  if (!token || token === "undefined") {
    return false;
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return false;
    }
  });

  return true;
};

exports.getReports = async (req, res) => {
  var queryParams = createQueryParams(req);

  const isAdmin = getIsAdmin(req, res);
  // get all report data
  console.log(isAdmin);
  if (isAdmin) {
    Report.findAll(queryParams)
      .then((reportData) => {
        res.status(200).send(reportData);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Beim Abrufen der Meldungen ist ein Fehler aufgetreten",
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
        message:
          err.message ||
          "Beim Abrufen der aktiven, öffentlichen Meldungen ist ein Fehler aufgetreten",
      });
    });
};

exports.postReport = async (req, res) => {
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
    constructionCosts: req.body.constructionCosts
      ? req.body.constructionCosts
      : "",
  };
  Report.create(report)
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Während der Erzeugung der Meldung ist ein Datenbankfehler aufgetreten",
      });
    });
};

exports.updateReport = async (req, res) => {
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

  // if (req.file){
  //   updateFields = {...updateFields, imgPath:
  //     req.file && req.file.filename
  //       ? process.env.IMAGE_DIR + "/" + req.file.filename
  //       : "",}
  // }

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
        message:
          err.message ||
          "Inkorrekte Meldungsdaten, die Aktualisierung funktioniert nicht",
      });
    });
};

exports.deleteReport = async (req, res) => {
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
        message:
          err.message ||
          "Während des Löschens der Meldung ist ein Datenbankfehler aufgetreten",
      });
    });
};

exports.reportDefect = async (req, res) => {
  const mailResponse = await sendMail(req.body, req.files).catch((err) => err);

  if (mailResponse instanceof Error) {
    res.status(500).send({ message: mailResponse.message });
  } else {
    res.status(200).send(mailResponse);
  }
};

exports.reportDefectExternal = async (req, res) => {
  if (
    req.body.meldung != undefined &&
    req.body.meldung.sachdaten != undefined
  ) {
    defect = req.body.meldung.sachdaten;
    defectImage = req.body.meldung.anhaenge;

    var location = [];
    var imagePaths = [];
    var address = {
      county: "Hünfeld",
      display_address: "Hünfeld",
    };

    if (defect.geom != undefined && defect.geom != "") {
      var geomPrefix = "POINT(";
      var geom = defect.geom.substring(
        geomPrefix.length,
        defect.geom.length - 2
      );
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
        var filePath = `${fileBasePath}/${uuidv4()}-starkregenmelder.${img.mime_typ.substring(
          6
        )}`;

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
          message:
            err.message ||
            "Während der Erzeugung der Meldung ist ein Datenbankfehler aufgetreten",
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
  var dateQuery = {
    endDate: {
      [Op.or]: [{ [Op.gte]: new Date() }, { [Op.eq]: null }],
    },
  };
  if (req.query.state) {
    if (req.query.state === "archived") {
      dateQuery.startDate = { [Op.lt]: new Date() };
      dateQuery.endDate = { [Op.lt]: new Date() };
    } else if (req.query.state === "active") {
      dateQuery.startDate = { [Op.lte]: new Date() };
      dateQuery.endDate = { [Op.gte]: new Date() };
    } else if (req.query.state === "planned") {
      dateQuery.startDate = { [Op.gt]: new Date() };
      dateQuery.endDate = { [Op.gt]: new Date() };
    } else if (req.query.state === "all") {
      dateQuery.startDate = {
        [Op.or]: [{ [Op.gte]: new Date() }, { [Op.lte]: new Date() }],
      };
      dateQuery.endDate = {
        [Op.or]: [{ [Op.gte]: new Date() }, { [Op.lte]: new Date() }],
      };
    }
  }
  queryParams.where = dateQuery;
  if (req.query.category) {
    if (queryParams.where === undefined) {
      queryParams.where = {};
    }
    queryParams.where.category = req.query.category;
  }

  return queryParams;
}
