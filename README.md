# How to run the project locally:
Copy the envs in .env.local file
npm run local
It will start a docker-compose with Localstack (local host for S3) and a postgres image.

# How to run integration test:
Copy the envs in .env.test file
npm run test:integration
it will start another docker-compose with 2 simple integration test:

- Ping
- Upload file

# How to run unit test:

npm run test:unit
it runs 2 unit test:

- src/controllers/files/upload-file/index.test.ts
  - Upload File controller
- src/services/s3/utils/s3-upload-file/index.test.ts
  - util to upload file on s3

# Swagger UI

Swagger UI: http://localhost:PORT/docs
-> Set Auth before any try
    - Click on the top-right button
    - Set username and password (you can find them in .env - At the end of this file is wrote down all envs to facilitate the access)

# DB files table structure

 id | title | description | category | language | provider | roles | s3key | created_at | updated_at
----+-------+-------------+----------+----------+----------+-------+-------+------------+------------

# APIs

Method  Route       Description
POST    /files      Upload file + metadata
GET     /files      List all uploaded files
GET     /files/:id	Get file metadata + download URL
GET     /stats      Aggregated stats
GET     /docs       API Playground (Swagger/Postman)

# Swagger UI

http://localhost:5005/docs/

# Stats query

## Total Updates:

SELECT count('id') FROM files LIMIT 1;

## Total Uploads per Category

SELECT count(id) AS count, category FROM files GROUP BY category ORDER BY count DESC;

## Total Uploads per roles

SELECT count(id) AS count, role FROM files, unnest(roles) AS role GROUP BY role ORDER BY count DESC;

# How to handle big files:

While the final result by using SSt is to have the APIs exposed in a Lambda funtions, we should consider that the API Gateway limit is 10MB.
In order to Upload bigger files, we can use the pre-signed url to upload files since 5GB directly in S3 (PUT object)
If the file is bigger than 5GB, then we ca consider to use the S3 multipart uploads.

# Describe any scaling or multi-tenant considerations you’d make if this went to production

If the app should go in a real PROD env, so the apps needs to serve multiple users and orgs (multi-tenancy), I'll consider the following:

1. Database

   1. Connection Poolin with RDS in order to optimize the connections: when the app service finish the operation, the connection poller will keep that connection opened in order to reduce the number of active connections that database should handle, optimizing the performances
2. S3:

   1. Use a well defined keys structure (eg category/language/year/month/day/hour/file_id.ext) to optmize the queries.
3. Caching

   1. Rarely-used files may overhead the databases, we can consider to use a dedicated caching layer such as Redis to handle the db datas
4. Logging

   1. application logger, such as Pino.js to easy-handle logs while writing code and to have an easy handlement of errors/fatal logs
   2. CloudWatch with SNS to handle all metrics and notify if something is not working as expected
5. Cost reduction

   1. in order to avoid extreme costs, code optimization is a must when writing Lambda functions

## Multi-tenancy considerations

* The main risk of multi-tenancy is that the data may be visible to others tenants. In the Db we should add the tenant_id on tables in order to do all queries filtered by tenant_id eg. WHERE tenant_id = '123';
  We can also consider to have different schema for each tenant, but it is more complex to handle and manage
* Auth: we should consider a method to retrieve data for the specific tenant.
* Logging and monitor: we should be able to read logs and metrics for each tenant, the tenant_id may help in this process.


# ENV
## START LOCAL ENV
PORT=5005
SST_URL=http://localhost:5005

# API AUTH
PRIVATE_BASIC_AUTH_USERNAME=superuser@
PRIVATE_BASIC_AUTH_PWD=only_for_test
# S3
PRIVATE_S3_CLIENT_KEY_ID=key_id_local
PRIVATE_S3_CLIENT_SECRET=secret_local
S3_URL=http://localhost:4566
# POSTGRES
POSTGRES_PORT=5436
PRIVATE_POSTGRES_PASSWORD=pgres_pwd
PRIVATE_POSTGRES_USERNAME=pgres_username
POSTGRES_DB=pgres_local_db
POSTGRES_HOST=localhost
## END LOCAL ENV

## START TEST ENV
PORT=5009
SST_URL=http://localhost:5009
NODE_ENV=test
# API AUTH
PRIVATE_BASIC_AUTH_USERNAME=integration-user@
PRIVATE_BASIC_AUTH_PWD=integration-PWD
# S3
PRIVATE_S3_CLIENT_KEY_ID=key_id_integration
PRIVATE_S3_CLIENT_SECRET=secret_integration
S3_URL=http://localhost:4569
# POSTGRES
POSTGRES_PORT=5439
PRIVATE_POSTGRES_PASSWORD=pgres_pwd_integration
PRIVATE_POSTGRES_USERNAME=pgres_username_integration
POSTGRES_DB=pgres_integration_db
POSTGRES_HOST=localhost
## END TEST ENV