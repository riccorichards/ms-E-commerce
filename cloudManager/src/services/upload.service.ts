import { Bucket, GetSignedUrlConfig, Storage } from "@google-cloud/storage";
import log from "../utils/logger";
import sharp from "sharp";

//define the place in the GCP via our crenetials
const storage = new Storage({
  keyFilename: process.env["GOOGLE_APPLICATION_CREDENTIALS"],
});

//define the bucket in the GCP
const bucket: Bucket = storage.bucket(process.env["GOOGLE_CLOUD_BUCKET_NAME"]!);

//converting the file into webp
export const convertImageToWebP = async (
  file: Express.Multer.File // the function needs to receive file (type of multer file)
): Promise<Buffer> => {
  // returns promise Buffer
  try {
    //The function uses the Sharp library to convert the image contained in file.buffer to WebP format. The .webp() method of Sharp specifies the target format. toBuffer()then converts the result back into a Buffer object.
    const webpBuffer = await sharp(file.buffer).webp().toBuffer();
    if (!webpBuffer) throw new Error("Error while converting file");
    return webpBuffer;
  } catch (error) {
    log.error("Error converting image to WebP:", error);
    throw error;
  }
};

//uploading process to the GCP. the function takes two params, one it converted file into webp and second one is the full name of file which should used in the GCP
export const FileUploadToCloud = async (
  webPBuffer: Buffer,
  webExtansion: string
): Promise<void> => {
  const blob = bucket.file(webExtansion);
  const blobStream = blob.createWriteStream({
    //creating the blobstream for metadata
    metadata: {
      contentType: "image/webp",
    },
  });

  // the fuction returns promise
  return new Promise((resolve, reject) => {
    blobStream.on("error", (err) => {
      //blob has error option, so if the received an error we can handle it
      log.error(err.message);
      reject(err);
    });
    //and if where is not error we are finishing the uploading process
    blobStream.on("finish", () => {
      resolve();
    });
    // and ending the blob
    blobStream.end(webPBuffer);
  });
};

interface GenResposeUrlWithTitleType {
  url: string;
  title: string;
}
//the fucntion returns promise
export const GenerateImageUrl = async (
  filename: string
): Promise<GenResposeUrlWithTitleType> => {
  const option: GetSignedUrlConfig = {
    version: "v4", // define the version
    action: "read", // define the action we need
    expires: Date.now() + 1000 * 60 * 30, // define the half hour (expiration time of url)
  };

  const [row] = await bucket.file(filename).getSignedUrl(option);
  return {
    url: row,
    title: filename,
  };
};

//handle removing process of file to the cloud
export const RemoveFileFromGoogleCloud = async (
  filename: string
): Promise<string> => {
  const file = bucket.file(filename);
  await file.delete();

  return filename;
};
