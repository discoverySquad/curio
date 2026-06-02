import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, displayConnectionS3 } from "../database/s3.js";

const getSignedUrlFromS3 = async(key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });
  return await getSignedUrl(s3, command, {expiresIn: 4800});
};

export {getSignedUrlFromS3};