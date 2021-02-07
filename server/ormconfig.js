module.exports = {
  type: 'mysql',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: false,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  cli: {
    migrationsDir: 'migration',
  },
};
