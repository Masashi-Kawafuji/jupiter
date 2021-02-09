import { createConnection } from 'typeorm';
import app from './app';
import connectionOptions from './config/connectionOptions';

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
