const db = require("../db/models");
const ClimateProject = db.climate_project;
const { ensurePermission } = require("../utils/ensure-permission");

const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

exports.getClimateProjects = async (req, res) => {
  let isBackOfficeRequest = false;
  if (Object.values(req.query).includes("all")) {
    isBackOfficeRequest = true;
  }

  if ((!req.query.category || !req.query.timeHorizon) && !isBackOfficeRequest) {
    console.log("Incoming request has too few query params to get climate projects.");
    res.status(200).send([]);
    return;
  }

  let queryParams = createQueryParams(req);

  const isClimateAdmin = req.permissions === "all" || req.permissions.includes("klima_perm");

  if (isClimateAdmin) {
    ClimateProject.findAll(queryParams)
      .then((projectData) => {
        res.status(200).send(projectData);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Beim Abrufen der Klimaprojekte ist ein Fehler aufgetreten",
        });
      });
    return;
  }

  // get project data suitable for the public
  queryParams.attributes = [
    "id",
    "title",
    "description",
    "startDate",
    "endDate",
    "imgPath",
    "location",
    "locationText",
    "category",
    "timeHorizon",
    "costs",
    "responsible",
    "link",
  ];

  if (queryParams.where == undefined) {
    queryParams.where = {};
  }
  queryParams.where.public = true;

  ClimateProject.findAll(queryParams)
    .then((publicProjectData) => {
      res.status(200).send(publicProjectData);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Beim Abrufen der öffentlichen Klimaprojekte ist ein Fehler aufgetreten",
      });
    });
};

exports.postClimateProject = async (req, res) => {
  if (!ensurePermission(req, res, "klima_perm")) {
    return; // Return early if permissions are not sufficient
  }

  if (
    !req.body.title ||
    !req.body.description ||
    (!req.body.location && !req.body.locationText) ||
    !req.body.category ||
    !req.body.timeHorizon
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

  const project = {
    title: req.body.title,
    description: req.body.description,
    startDate: req.body.startDate && req.body.startDate !== "null" ? req.body.startDate : null,
    endDate: req.body.endDate && req.body.endDate !== "null" ? req.body.endDate : null,
    imgPath: imagePaths,
    location: JSON.parse(req.body.location) ? JSON.parse(req.body.location) : null,
    locationText: req.body.locationText,
    category: req.body.category,
    timeHorizon: req.body.timeHorizon,
    costs: req.body.costs,
    responsible: req.body.responsible,
    link: req.body.link,
    public: false,
  };

  ClimateProject.create(project)
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Während der Erzeugung des Klimaprojekts ist ein Datenbankfehler aufgetreten",
      });
    });
};

exports.updateClimateProject = async (req, res) => {
  if (!ensurePermission(req, res, "klima_perm")) {
    return; // Return early if permissions are not sufficient
  }

  if (!req.params.id) {
    res.status(400).send({
      message: "Fehlende id",
    });
    return;
  }

  const project = await ClimateProject.findByPk(req.params.id);
  if (!project) {
    res.status(400).send({
      message: "Klimaprojekt wurde nicht gefunden",
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
    let newImgPaths = [...project.imgPath];
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
        imgPath: [...project.imgPath, ...imagePaths],
      };
    }
  }

  if (updateFields.location) {
    updateFields = {
      ...updateFields,
      location: JSON.parse(updateFields.location),
    };
  }
  if (updateFields.startDate) {
    updateFields = {
      ...updateFields,
      startDate: updateFields.startDate !== "null" ? updateFields.startDate : null,
    };
  }
  if (updateFields.endDate) {
    updateFields = {
      ...updateFields,
      endDate: updateFields.endDate !== "null" ? updateFields.endDate : null,
    };
  }

  project
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

exports.deleteClimateProject = async (req, res) => {
  if (!ensurePermission(req, res, "klima_perm")) {
    return; // Return early if permissions are not sufficient
  }

  if (!req.params.id) {
    res.status(400).send({
      message: "Fehlende id",
    });
    return;
  }

  const project = await ClimateProject.findByPk(req.params.id);
  if (!project) {
    res.status(400).send({
      message: "Klimaprojekt wurde nicht gefunden",
    });
    return;
  }

  if (project.imgPath && project.imgPath.length > 0) {
    for (const imagePath of project.imgPath) {
      try {
        await unlinkAsync(__basedir + imagePath);
      } catch (err) {
        console.log(err);
        res.status(500).send({
          message: "Beim Löschen eines Projektbilds ist ein Fehler aufgetreten",
        });
        return;
      }
    }
  }

  project
    .destroy()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "Während des Löschens des Klimaprojekts ist ein Datenbankfehler aufgetreten",
      });
    });
};

function createQueryParams(req) {
  queryParams = {};
  queryParams.where = {};

  if (req.query.category && req.query.category !== "all") {
    queryParams.where.category = req.query.category;
  }
  if (req.query.timeHorizon && req.query.timeHorizon !== "all") {
    queryParams.where.timeHorizon = req.query.timeHorizon;
  }

  return queryParams;
}
