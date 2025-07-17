import { startServer, stopServer } from '../src/server';
import db from '../src/services/db';

let server: import('http').Server;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  server = await startServer();
  await db.deleteFrom('files').execute();
});

afterAll(async () => {
  await stopServer();
    await db.deleteFrom('files').execute();
});
