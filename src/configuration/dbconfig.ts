import { join } from 'path';
import dotenv from 'dotenv';
dotenv.config();

import { DataSource, DataSourceOptions } from 'typeorm';

const dbConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  username: process.env.DB_USER,
  password: 'Trustornot7.7.7@@',
  database: process.env.DB_DBNAME,
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  // We are using migrations, synchronize should be set to false.
  synchronize: false,
  dropSchema: false,
  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: false,
  logging: process.env.MODE === 'production' ? false : true,
  migrations: [join(__dirname, '../migrations/**/*{.ts,.js}')],
};
export const dataSource = new DataSource(dbConfig);

export default dbConfig;
