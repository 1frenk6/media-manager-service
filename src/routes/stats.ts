

import { Router } from 'express';
import getStats from '../controllers/stats/get-stats';

const statsRouter = Router();
/**
 * @openapi
 * /stats:
 *   get:
 *     tags:
 *       - Stats
 *     summary: Stats
 *     responses:
 *       200:
 *         description: Stats
 */
statsRouter.get('/', getStats);

export default statsRouter;
