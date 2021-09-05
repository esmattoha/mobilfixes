// Import Dependencies
const multer = require("multer");

// file mimetype check
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/webp" ||
    file.mimetype == "image/svg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

/*
 *  Rename and upload the file to "upload" Folder
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replaceAll(" ", "-"));
  },
});

/*
 *  File size limit
 */
const limits = {
  files: 1,
  fileSize: 5 * 1024 * 1024,
};

// we upload all the incomming files here
const upload = multer({
  storage: storage,
  limits: limits,
  fileFilter: fileFilter,
});

module.exports = upload;
