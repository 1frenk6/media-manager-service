import dotenv from 'dotenv';
import path from 'path';

// TODO: Optimize for all envs;
const fileName = `.env.${process.env.NODE_ENV}`;
dotenv.config({ path: path.resolve(__dirname, fileName)});

// Global configs
// TODO: Define an interface
const CONFIGS = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT ? Number(process.env.PORT) : 5005,
  SERVER_URL: process.env.SST_URL || `http://localhost:${process.env.PORT || 5005}`,
  PRIVATE_AUTH_USERNAME: process.env.PRIVATE_BASIC_AUTH_USERNAME,
  PRIVATE_AUTH_PWD: process.env.PRIVATE_BASIC_AUTH_PWD,
  S3: {
    CLIENT_KEY_ID: process.env.PRIVATE_S3_CLIENT_KEY_ID,
    CLIENT_SECRET: process.env.PRIVATE_S3_CLIENT_SECRET,
    BUCKET_NAME: 'fvitelli-files',
    URL: process.env.S3_URL,
  },
  DB: {
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    PRIVATE_POSTGRES_PASSWORD: process.env.PRIVATE_POSTGRES_PASSWORD,
    PRIVATE_POSTGRES_USERNAME: process.env.PRIVATE_POSTGRES_USERNAME,
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_HOST: process.env.POSTGRES_HOST,
  }
};

export default CONFIGS;
