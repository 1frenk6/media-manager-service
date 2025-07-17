import { CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../services/s3/client';
import CONFIGS from '../../config';

export async function initS3() {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: CONFIGS.S3.BUCKET_NAME }));
    console.debug('Bucket Already created');
  } catch {
    await s3Client.send(new CreateBucketCommand({ Bucket: CONFIGS.S3.BUCKET_NAME }));
    console.debug('Bucket created');
  }
}
