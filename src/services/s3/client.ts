import { S3Client } from '@aws-sdk/client-s3';
import CONFIGS from '../../../config';

// TODO: Use process.env.NODE_ENV to define Prod environment
const isIntegrationTest = CONFIGS.NODE_ENV == 'test';

export const s3Client = new S3Client({
  region: 'eu-north-1',
  endpoint: CONFIGS.S3.URL,
  // isIntegrationTest ? 'http://localhost:4569' : 'http://localhost:4566',
  forcePathStyle: true,
  credentials: {
    accessKeyId: CONFIGS.S3.CLIENT_KEY_ID || '',
    secretAccessKey: CONFIGS.S3.CLIENT_SECRET || '',
  },
});
