import { ConnectionOptions } from 'typeorm';

const isProduction = process.env.NODE_ENV === 'production';

const connectionOptions: ConnectionOptions = {
  synchronize: !isProduction,
  logging: false,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  cli: {
    migrationsDir: 'migrations',
  },
};

export default connectionOptions;
