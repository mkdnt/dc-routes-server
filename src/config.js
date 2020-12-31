module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://owxrzedysensjc:63688b64d58db0e316601a9dc17296b8594e81830fa11ab8421afb3265954481@ec2-23-23-88-216.compute-1.amazonaws.com:5432/d84o6g5kmjd6q7',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://MikeDent@localhost/dc-routes-test',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'https://dc-routes-client.vercel.app'
};
