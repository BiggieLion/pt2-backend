import * as Joi from '@hapi/joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  PORT: Joi.number(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DBNAME: Joi.string().required(),
  DB_LOGGING: Joi.boolean().required(),
  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY: Joi.string().required(),
  AWS_SECRET_KEY: Joi.string().required(),
  COGNITO_USER_POOL_ID: Joi.string().required(),
  COGNITO_CLIENT_ID: Joi.string().required(),
  COGNITO_REQUESTER_GROUP: Joi.string().required(),
  COGNITO_ANALYST_GROUP: Joi.string().required(),
  COGNITO_SUPERVISOR_GROUP: Joi.string().required(),
});
