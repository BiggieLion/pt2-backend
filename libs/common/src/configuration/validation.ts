import * as Joi from '@hapi/joi';

export const validationSchema = Joi.object({
  // API
  NODE_ENV: Joi.string().required(),
  PORT: Joi.number(),
  // Database
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DBNAME: Joi.string().required(),
  DB_LOGGING: Joi.boolean().required(),
  // AWS
  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY: Joi.string().required(),
  AWS_SECRET_KEY: Joi.string().required(),
  // Cognito
  COGNITO_USER_POOL_ID: Joi.string().required(),
  COGNITO_CLIENT_ID: Joi.string().required(),
  COGNITO_REQUESTER_GROUP: Joi.string().required(),
  COGNITO_ANALYST_GROUP: Joi.string().required(),
  COGNITO_SUPERVISOR_GROUP: Joi.string().required(),
  COGNITO_AUTHORITY: Joi.string().required(),
  // Resend
  RESEND_AUTH_USER: Joi.string().required(),
  RESEND_AUTH_PASSWORD: Joi.string().required(),
  RESEND_SMTP_HOST: Joi.string().required(),
  RESEND_SMTP_PORT: Joi.number().required(),
  RESEND_SMTP_EMAIL: Joi.string().required(),
  // Microservices
  AUTH_HOST: Joi.string().required(),
  AUTH_PORT: Joi.number().required(),
  REQUEST_HOST: Joi.string().required(),
  REQUEST_PORT: Joi.number().required(),
  REQUESTER_HOST: Joi.string().required(),
  REQUESTER_PORT: Joi.number().required(),
  NOTIFICATIONS_HOST: Joi.string().required(),
  NOTIFICATIONS_PORT: Joi.number().required(),
  STAFF_HOST: Joi.string().required(),
  STAFF_PORT: Joi.number().required(),
  DOCUMENTS_HOST: Joi.string().required(),
  DOCUMENTS_PORT: Joi.number().required(),
  // Auth
  AUTH_HTTP_PORT: Joi.number().required(),
  AUTH_TCP_PORT: Joi.number().required(),
  // Request
  REQUEST_HTTP_PORT: Joi.number().required(),
  REQUEST_TCP_PORT: Joi.number().required(),
  // Requester
  REQUESTER_HTTP_PORT: Joi.number().required(),
  REQUESTER_TCP_PORT: Joi.number().required(),
  // Staff
  STAFF_HTTP_PORT: Joi.number().required(),
  STAFF_TCP_PORT: Joi.number().required(),
  // Notifications
  NOTIFICATIONS_HTTP_PORT: Joi.number().required(),
  NOTIFICATIONS_TCP_PORT: Joi.number().required(),
  // Documents
  DOCUMENTS_HTTP_PORT: Joi.number().required(),
  DOCUMENTS_TCP_PORT: Joi.number().required(),
});
