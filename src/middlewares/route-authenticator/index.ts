
import type { Request, Response, NextFunction } from 'express';
import CONFIGS from '../../../config';

/**
 * @description Implemented a Basic Auth to facilitate the core development.
 */
export default function routeAuthenticator(req: Request, res: Response, next: NextFunction) {
  const { PRIVATE_AUTH_PWD, PRIVATE_AUTH_USERNAME } = CONFIGS;

  if (!PRIVATE_AUTH_PWD || !PRIVATE_AUTH_USERNAME) {
    console.debug('Basic Auth credentials not set in environment variables.');
    return res.status(500).json({
      error: 'Internal Server Error',
    });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    const msg = 'Missing Authorization header';
    console.debug(msg);
    return res.status(401).json({ error: msg });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const [username, password] = Buffer.from(base64Credentials, 'base64').toString().split(':');

  if (username !== PRIVATE_AUTH_USERNAME || password !== PRIVATE_AUTH_PWD) {
    return res.status(403).json({ error: 'Invalid credentials' });
  }

  next();
}
