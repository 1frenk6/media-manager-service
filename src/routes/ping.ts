import { Router, type Response } from 'express';

const pingRoutes = Router();

/**
 * @openapi
 * /ping:
 *   get:
 *     summary: Ping
 *     responses:
 *       200:
 *         description:  Ping Server to check Healt Status
 */
pingRoutes.get('/', (_, res: Response) => {
  res.send({ message: 'pong' });
});

export default pingRoutes;
