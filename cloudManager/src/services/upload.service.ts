import { Bucket, GetSignedUrlConfig, Storage } from "@google-cloud/storage";
import log from "../utils/logger";
import sharp from "sharp";

const storage = new Storage({
  keyFilename: process.env["GOOGLE_APPLICATION_CREDENTIALS"],
});

const bucket: Bucket = storage.bucket(process.env["GOOGLE_CLOUD_BUCKET_NAME"]!);

export const convertImageToWebP = async (
  file: Express.Multer.File
): Promise<Buffer> => {
  try {
    const webpBuffer = await sharp(file.buffer).webp().toBuffer();
    if (!webpBuffer) throw new Error("Error while converting file");
    return webpBuffer;
  } catch (error) {
    log.error("Error converting image to WebP:", error);
    throw error;
  }
};

export const FileUploadToCloud = async (
  webPBuffer: Buffer,
  webExtansion: string
): Promise<void> => {
  const blob = bucket.file(webExtansion);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: "image/webp",
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (err) => {
      log.error(err.message);
      reject(err);
    });

    blobStream.on("finish", () => {
      resolve();
    });

    blobStream.end(webPBuffer);
  });
};

interface GenResposeUrlWithTitleType {
  url: string;
  title: string;
}

export const GenerateImageUrl = async (
  filename: string
): Promise<GenResposeUrlWithTitleType> => {
  const option: GetSignedUrlConfig = {
    version: "v4",
    action: "read",
    expires: Date.now() + 3600 * 7000 * 15,
  };

  const [row] = await bucket.file(filename).getSignedUrl(option);
  return {
    url: row,
    title: filename,
  };
};

export const RemoveFileFromGoogleCloud = async (
  filename: string
): Promise<string> => {
  const file = bucket.file(filename);
  await file.delete();

  return filename;
};
