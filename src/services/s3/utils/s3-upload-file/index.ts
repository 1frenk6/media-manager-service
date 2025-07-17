import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import CONFIGS from '../../../../../config';
import { s3Client } from '../../client';
import buildS3Url from '../build-s3-url';

export default async function s3UploadFile(file: Express.Multer.File) {
  const fileId = uuidv4();
  const s3Key = `${fileId}-${file.originalname}`;

  // Upload su S3
  await s3Client.send(
    new PutObjectCommand({
      Bucket: CONFIGS.S3.BUCKET_NAME,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );
  const s3url = buildS3Url(CONFIGS.S3.BUCKET_NAME, s3Key);

  return {
    s3url,
    fileId,
    s3Key
  };
}
