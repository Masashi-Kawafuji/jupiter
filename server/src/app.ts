import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import routes from './routes';

dotenv.config({
  path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`),
});

const app = express();

// use middlewares
app.use(morgan('dev'));
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production' ? process.env.CORS_ORIGIN : '*',
    credentials: true,
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());

// use routes
app.use(routes);

export default app;
