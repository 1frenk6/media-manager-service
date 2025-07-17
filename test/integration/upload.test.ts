import request from 'supertest';
import path from 'path';
import db from '../../src/services/db';
import app from '../../src/app';

describe('POST /files/upload', () => {
  it('should upload a file with metadata and store it in DB', async () => {
    const testFilePath = path.resolve(__dirname, '../fixtures/test-file.txt');
    // Bypass routeAuthenticator
    const username = process.env.PRIVATE_BASIC_AUTH_USERNAME!;
    const password = process.env.PRIVATE_BASIC_AUTH_PWD!;
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');

    const res = await request(app)
      .post('/files')
      .set('Authorization', `Basic ${credentials}`)
      .field('title', 'Test file')
      .field('description', 'This is a test file')
      .field('category', 'test-category')
      .field('language', 'en')
      .field('provider', 'test-provider')
      .field('roles', 'admin,viewer')
      .attach('file', testFilePath);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('message', 'File uploaded');

    // delete test file from DB
    await db.deleteFrom('files').where('id', '=', res.body.id).execute();
    // TODO: Cleanup S3
  });

  // TODO: Additional test on failed body and file
});
