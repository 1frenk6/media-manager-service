import type { Response } from 'express';
import { CreateBucketCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../client';

export default async function createBucket(_: Request, res: Response) {
  try {
    const command = new CreateBucketCommand({ Bucket: 'my-test-bucket' });
    await s3Client.send(command);
    res.send({ status: 'Bucket created' });
  } catch (error) {
    res.status(500).send({ error });
  }
}
