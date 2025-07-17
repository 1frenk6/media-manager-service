import type { Request, Response } from 'express';
import db from '../../../services/db';
import { UserRole, DatabaseTablesEnum } from '../../../services/db/_types';
import s3UploadFile from '../../../services/s3/utils/s3-upload-file';

export default async function uploadFile(req: Request, res: Response) {
  try {
    // TODO: Zod validation as middleware
    const { title, description, category, language, provider, roles } = req.body;
    if (!title || !category || !language || !provider || !roles) {
      return res.status(400).json({ error: 'Missing metadata fields' });
    }
    const parsedRoles = roles.split(',');
    for (const idx in parsedRoles) {
      if (!Object.values(UserRole).includes(parsedRoles[idx] as UserRole)) {
        console.log('oooh', parsedRoles[idx]);
        // TODO: Zod validation as middleware
        return res.status(400).json({ error: `Invalid Role Metadata ${parsedRoles[idx]}` });
      }
    }

    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }
    const { s3Key } = await s3UploadFile(req.file);
    const result = await db
      .insertInto(DatabaseTablesEnum.Files)
      .values({
        title,
        description,
        category,
        language,
        provider,
        roles: parsedRoles,
        s3key: s3Key,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning(['id'])
      .executeTakeFirstOrThrow();

    console.log(`DB Record saved: ${result.id}`);
    res.status(200).json({ message: 'File uploaded', id: result.id });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
