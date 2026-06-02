import { S3Client, HeadBucketCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const displayConnectionS3 = async() => {
  try{
    await s3.send(new HeadBucketCommand({
      Bucket: process.env.S3_BUCKET_NAME
    }));
    console.log("S3 connected");
  }catch(error){
    console.log("S3 connection failed:", error);
  }
};

export {s3, displayConnectionS3};