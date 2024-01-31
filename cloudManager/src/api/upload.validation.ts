import multer, { FileFilterCallback } from "multer";
import path from "path";

//define storage for multer => it is necessary to store file to the server for processing (like convertion it into wepb)
const storage = multer.memoryStorage();

//here is information about what kind of file is handleable in the server
export const uploadFile = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    fileChecker(file, cb);
  },
}).single("upload"); // the server allows only single file

//checker function which defined the rules of uploading processes
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
