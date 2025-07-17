import fs from 'fs';
import path from 'path';
import db from '..';
import { sql } from 'kysely';
import CONFIGS from '../../../../config';

const migrationsDir = path.join(__dirname, '../../../../pg_data/migrations');

// TODO: Integrate https://www.npmjs.com/package/kysely-migrate 
export default async function runMigrations() {
  const files = fs
    .readdirSync(migrationsDir)
    // TODO: Define as CONST
    .filter((file) => file.endsWith('.sql'))
    .sort();

  // TODO: Run all files
  const firstFile = files[0];

  if (!firstFile) {
    console.log('No migration files found.');
    return;
  }

  const fullPath = path.join(migrationsDir, firstFile);
  const sqlContent = fs.readFileSync(fullPath, 'utf8');
  console.debug(`Running migration: ${firstFile}`);

  try {
    console.log('CONFIGS123', CONFIGS)
    await db.executeQuery(sql.raw(sqlContent).compile(db));
    console.log(`Migration ${firstFile} executed successfully`);
  } catch (err) {
    console.error(`Error in migration ${firstFile}:`, err);
  } 
}
