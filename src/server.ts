import app from './app';
import CONFIGS from '../config';
import runMigrations from './services/db/scripts/run-migrations';
import { initS3 } from './utils/init-s3';

let server: import('http').Server | null = null;

export async function startServer() {
  if (server) return server;

  await Promise.all([initS3(), runMigrations()]);

  return new Promise<import('http').Server>((resolve, reject) => {
    console.log('CONFIGS.PORT', CONFIGS.PORT);
    server = app.listen(CONFIGS.PORT, () => {
      console.log(`Server started on port: ${CONFIGS.PORT}`);
      console.log(`Swagger UI: ${CONFIGS.SERVER_URL}/docs`);
      resolve(server!);
    });

    server.on('error', (err) => reject(err));
  });
}

export async function stopServer() {
  if (!server) return;
  return new Promise<void>((resolve, reject) => {
    server!.close((err) => {
      if (err) reject(err);
      else {
        console.log('Server stopped');
        server = null;
        resolve();
      }
    });
  });
}
