
import type { Request, Response } from 'express';
import db from '../../../services/db';
import { DatabaseTablesEnum } from '../../../services/db/_types';


export default async function listFiles(req: Request, res: Response) {
  try {
    // TODO: Filters and Pagination
    const files = await db.selectFrom(DatabaseTablesEnum.Files).selectAll().execute();
    res.status(200).json(files);
  } catch (err) {
    console.error('Error fetching files:', err);
    res.status(500).json({ message: 'Failed to list files', err });
  }
}
