const {
  PORT,
  CONNECTION_URL,
  JWT_SECRET,
  SENDER_EMAIL,
  EMAIL_PASSWORD,
  AWS_ACCESS_KEY,
  AWS_SECRECT_ACCESS_KEY,
  AWS_BUCKET_NAME,
  AWS_REGION
} = process.env;

module.exports = {
  port: PORT,
  connectionURL: CONNECTION_URL,
  jwtSecret: JWT_SECRET,
  senderEmail: SENDER_EMAIL,
  emailPassword: EMAIL_PASSWORD,
  awsAccessKey: AWS_ACCESS_KEY,
  awsSecrectAccessKey: AWS_SECRECT_ACCESS_KEY,
  awsBusketName: AWS_BUCKET_NAME,
  awsRegion: AWS_REGION,
};
