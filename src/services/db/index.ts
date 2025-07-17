import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import CONFIGS from '../../../config';
import { Database } from './_types';

/**
 * @doc https://kysely.dev/docs/getting-started#instantiation
 */
const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      database: CONFIGS.DB.POSTGRES_DB,
      host: CONFIGS.DB.POSTGRES_HOST,
      user: CONFIGS.DB.PRIVATE_POSTGRES_USERNAME,
      password: CONFIGS.DB.PRIVATE_POSTGRES_PASSWORD,
      port: Number(CONFIGS.DB.POSTGRES_PORT),
      max: 10,
      ...(CONFIGS.NODE_ENV === 'local' || CONFIGS.NODE_ENV === 'test' ? {} : { ssl: { rejectUnauthorized: false } }),
    }),
  }),
});

export default db;
