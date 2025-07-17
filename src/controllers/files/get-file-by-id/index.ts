import type { Request, Response } from 'express';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import CONFIGS from '../../../../config';
import db from '../../../services/db';
import { s3Client } from '../../../services/s3/client';

const PRESIGNED_URL_EXPIRATION_IN_SECONDS = 60 * 10; // 10 mins
export default async function getFileById(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const file = await db.selectFrom('files').selectAll().where('id', '=', id).executeTakeFirst();

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const command = new GetObjectCommand({
      Bucket: CONFIGS.S3.BUCKET_NAME,
      Key: file.s3key,
      // Force download, remove it if not needed
      ResponseContentDisposition: `attachment; filename="${file.s3key}"`,
    });

    const s3Response = await s3Client.send(command);

    if (!s3Response.Body) {
      return res.status(404).json({ message: 'File content not found in S3' });
    }
    res.setHeader('Content-Disposition', `attachment; filename="${file.s3key}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    return (s3Response.Body as any).pipe(res);
    // Otherwise we can sign the URL
    // const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: PRESIGNED_URL_EXPIRATION_IN_SECONDS });
    // res.json({
    //   ...file,
    //   downloadUrl: signedUrl,
    // });
  } catch (err) {
    console.error('Error getting file by ID:', err);
    res.status(500).json({ message: 'Failed to retrieve file' });
  }
}
