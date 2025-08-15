import multer from "multer";
import fs from "fs";

if (!fs.existsSync("./public")) {
  fs.mkdirSync("./public");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });
