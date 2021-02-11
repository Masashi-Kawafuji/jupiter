import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import routes from './routes';

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
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
app.use(express.json());

// routing
app.use(routes);

export default app;
