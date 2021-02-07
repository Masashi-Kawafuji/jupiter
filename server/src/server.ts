import express from 'express';
import { createConnection } from 'typeorm';

const app = express();

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  /* eslint-disable no-console */
  try {
    await createConnection();
    console.log(`Server is listening on port ${port}`);
  } catch (error) {
    console.error(error);
  }
});
