/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'media-manager-service',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      home: 'aws',
    };
  },
  // @doc https://sst.dev/docs/start/aws/express/
  async run() {
    const vpc = new sst.aws.Vpc('MyVpc');
    const cluster = new sst.aws.Cluster('MyCluster', { vpc });

    new sst.aws.Service('MediaManager', {
      cluster,
      loadBalancer: {
        ports: [{ listen: '80/http' }],
      },
      dev: {
        command: 'npm run dev',
      },
      environment: {
        // TODO: Set secrets
        PORT: process.env.PORT || '',
        SERVER_URL: process.env.SST_URL || '',
        POSTGRES_PORT: process.env.POSTGRES_PORT || '',
        PRIVATE_POSTGRES_PASSWORD: process.env.PRIVATE_POSTGRES_PASSWORD || '',
        PRIVATE_POSTGRES_USERNAME: process.env.PRIVATE_POSTGRES_USERNAME || '',
        POSTGRES_DB: process.env.POSTGRES_DB || '',
        POSTGRES_HOST: process.env.POSTGRES_HOST || '',
        PRIVATE_BASIC_AUTH_USERNAME: process.env.PRIVATE_BASIC_AUTH_USERNAME || '',
        PRIVATE_BASIC_AUTH_PWD: process.env.PRIVATE_BASIC_AUTH_PWD || '',
        PRIVATE_S3_CLIENT_KEY_ID: process.env.PRIVATE_S3_CLIENT_KEY_ID || '',
        PRIVATE_S3_CLIENT_SECRET: process.env.PRIVATE_S3_CLIENT_SECRET || '',
        S3_URL: process.env.S3_URL || '',
      }
    });
  },
});
