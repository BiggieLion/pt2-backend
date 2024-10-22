export const configuration = () => ({
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    logging: process.env.DB_LOGGING || false,
  },

  aws: {
    region: process.env.AWS_REGION,
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
  },

  cognito: {
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    clientId: process.env.COGNITO_CLIENT_ID,
    requesterGroup: process.env.COGNITO_REQUESTER_GROUP,
    analystGroup: process.env.COGNITO_ANALYST_GROUP,
    supervisorGroup: process.env.COGNITO_SUPERVISOR_GROUP,
    authority: process.env.COGNITO_AUTHORITY,
  },

  resend: {
    auth: {
      user: process.env.RESEND_AUTH_USER,
      password: process.env.RESEND_AUTH_PASSWORD,
    },
    smtp: {
      host: process.env.RESEND_SMTP_HOST,
      port: process.env.RESEND_SMTP_PORT,
      email: process.env.RESEND_SMTP_EMAIL,
    },
  },

  microservices: {
    auth: {
      host: process.env.AUTH_HOST,
      port: process.env.AUTH_PORT,
    },

    request: {
      host: process.env.REQUEST_HOST,
      port: process.env.REQUEST_PORT,
    },

    requester: {
      host: process.env.REQUESTER_HOST,
      port: process.env.REQUESTER_PORT,
    },

    staff: {
      host: process.env.STAFF_HOST,
      port: process.env.STAFF_PORT,
    },

    notifications: {
      host: process.env.NOTIFICATIONS_HOST,
      port: process.env.NOTIFICATIONS_PORT,
    },

    documents: {
      host: process.env.DOCUMENTS_HOST,
      port: process.env.DOCUMENTS_PORT,
    },
  },

  auth: {
    httpPort: process.env.AUTH_HTTP_PORT,
    tcpPort: process.env.AUTH_TCP_PORT,
  },

  request: {
    httpPort: process.env.REQUEST_HTTP_PORT,
    tcpPort: process.env.REQUEST_TCP_PORT,
  },

  requester: {
    httpPort: process.env.REQUESTER_HTTP_PORT,
    tcpPort: process.env.REQUESTER_TCP_PORT,
  },

  staff: {
    httpPort: process.env.STAFF_HTTP_PORT,
    tcpPort: process.env.STAFF_TCP_PORT,
  },

  notifications: {
    httpPort: process.env.NOTIFICATIONS_HTTP_PORT,
    tcpPort: process.env.NOTIFICATIONS_TCP_PORT,
  },

  documents: {
    httpPort: process.env.DOCUMENTS_HTTP_PORT,
    tcpPort: process.env.DOCUMENTS_TCP_PORT,
  },
});
