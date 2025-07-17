import swaggerJsdoc from 'swagger-jsdoc';
import CONFIGS from '../config';

/**
 * @doc Auth Documentation - https://swagger.io/docs/specification/v3_0/authentication/
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Media Manager Service API',
      version: '1.0.0',
      description: 'Media manager API service used to handle files',
    },
    servers: [
      {
        url: 'http://MediaManagerLoa-tukruewm-1043165547.eu-north-1.elb.amazonaws.com',
        describe: 'Production url',
      },
      {
        url: CONFIGS.SERVER_URL,
      },
    ],
    components: {
      securitySchemes: {
        basicAuth: {
          type: 'http',
          scheme: 'basic',
        },
      },
    },
    security: [
      {
        basicAuth: [],
      },
    ],
  },
  tags: [
    {
      name: 'Default',
      description: 'Ping and utility endpoints',
    },
    {
      name: 'Files',
      description: 'Upload, download, and manage files',
    },
    {
      name: 'Stats',
      description: 'Aggregated statistics and metrics',
    },
  ],
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
