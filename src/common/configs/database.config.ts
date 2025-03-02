import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenvConfig({ path: '.env' });
const dbConfig = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  autoLoadEntities: true,
  logging: true,
  entities: ['./dist/src/**/*.entity{.ts,.js}'],
  migrations: ['./dist/db/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: './db/migrations',
    entitiesDir: './src/**/*.entity{.ts,.js}',
  },
  namingStrategy: new SnakeNamingStrategy(),
};

export default registerAs('databaseConfig', () => dbConfig);
export const connectionSource = new DataSource(dbConfig as DataSourceOptions);

connectionSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
