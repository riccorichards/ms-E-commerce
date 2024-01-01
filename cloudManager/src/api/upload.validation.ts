import multer, { FileFilterCallback } from "multer";
import path from "path";

const storage = multer.memoryStorage();

export const uploadFile = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    fileChecker(file, cb);
  },
}).single("upload");

function fileChecker(file: Express.Multer.File, cb: FileFilterCallback) {
  const fileType = /jpeg|jpg|png/;

  const extname = fileType.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileType.test(file.mimetype);

  if (extname && mimeType) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}
