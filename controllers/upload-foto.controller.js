const multer = require("multer");
const path = require(`path`);
const fs = require("fs");

const storage = (destination) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = `./images/${destination}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      cb(null,dir)
    },

    filename: (req, file, cb) => {
      cb(null, `${destination}-` + Date.now() + path.extname(file.originalname));
    },
  });

const upload = (destination) =>
  multer({
    storage: storage(destination),
    fileFilter: (req, file, cb) => {
      const acceptedType = [`image/jpg`, `image/jpeg`, `image/png`];

      if (!acceptedType.includes(file.mimetype)) {
        cb(null, false);
        return cb(`invalid file type (${file.mimetype})`);
      }

      const fileSize = req.headers[`content-length`];
      const maxSize = 1 * 1024 * 1024;
      if (fileSize > maxSize) {
        cb(null, false);
        return cb(`file size is too large`);
      }

      cb(null, true);
    },
  });

  const uploadCustomer = upload('customer')
  const uploadRoomType = upload('roomtype')

module.exports = {
  uploadCustomer,
  uploadRoomType
};
