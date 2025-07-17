import request from 'supertest';
import app from '../../src/app';

describe('[Integration] /ping route', () => {
  it('should respond with pong', async () => {
    const res = await request(app).get('/ping');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'pong' });
  });
});
