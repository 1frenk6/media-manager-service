import express, { Response, NextFunction } from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import errorHandler from './middlewares/error-handler';
import fileRouter from './routes/files';
import pingRoutes from './routes/ping';
import statsRouter from './routes/stats';
import swaggerSpec from './swagger';
import { startServer } from './server';
import routeAuthenticator from './middlewares/route-authenticator';
import CONFIGS from '../config';

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan('dev'));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/ping', pingRoutes);
// Defining from here the route auth in order to allow the access to Swagger DOC and PING
app.use(routeAuthenticator);
app.use('/files', fileRouter);
app.use('/stats', statsRouter);

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}
export default app;
