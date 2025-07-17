
import type { Request, Response } from 'express';

import { type Selectable, sql } from 'kysely';
import db from '../../../services/db';
import { FileRecord } from '../../../services/db/_types';

export default async function getStats(req: Request, res: Response) {
  try {
    const totalUploads = await db.selectFrom('files').select(db.fn.count('id').as('total')).executeTakeFirst();
    console.log('Total uploads:', totalUploads?.total);

    const uploadsPerCategory = await db
      .selectFrom('files')
      .select(['category'])
      .select(db.fn.count('id').as('count'))
      .groupBy('category')
      .orderBy('count', 'desc')
      .execute();
    console.log('Total Upload Per Category: ', uploadsPerCategory);

    const uploadsPerRoles = await sql<Selectable<FileRecord>>`
        SELECT count(id) AS count, role 
        FROM files, unnest(roles) AS role 
        GROUP BY role 
        ORDER BY count DESC;
        `.execute(db);
    console.log('Total Uploads per role: ', uploadsPerRoles);

    res.status(200).json({
      totalUploads: totalUploads?.total || 0,
      uploadsPerCategory,
      uploadsPerRoles,
    });
  } catch (err) {
    console.error('Error fetching Stats:', err);
    res.status(500).json({ message: 'Failed to get STATS' });
  }
}
function Selectable(arg0: string) {
  throw new Error('Function not implemented.');
}
