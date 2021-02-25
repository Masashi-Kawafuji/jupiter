import { createConnection } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';
import app from './app';
import connectionOptions from './config/connectionOptions';

dotenv.config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
});

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  /* eslint-disable no-console */
  try {
    await createConnection(connectionOptions);
    console.log(`Server is listening on port ${port}.`);
  } catch (error) {
    console.log(error);
  }
});
