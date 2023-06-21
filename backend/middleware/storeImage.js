require("dotenv").config();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    file ? cb(null, __basedir + process.env.IMAGE_DIR) : cb(null, "");
  },
  filename: (req, file, cb) => {
    file
      ? cb(null, `${uuidv4()}-starkregenmelder.${file.mimetype.substring(6)}`)
      : cb(null, "");
  },
});

const storeImage = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
    } else {
        return cb(new Error('Zur Zeit werden nur folgende Bildformate unterstüzt: jpg, jpeg, png'));
    }
  },
  limits: { fileSize: 104857600 },
});

module.exports = storeImage;
