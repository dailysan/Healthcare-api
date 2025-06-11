import { DataSource } from 'typeorm';
import { typeOrmConfig } from './typeorm.config';

export const testDataSource = new DataSource({
  type: 'postgres' as const,
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.TEST_DB_NAME || 'healthcare_test',
  name: 'test',
  synchronize: true,
  dropSchema: true,
  logging: false,
  entities: typeOrmConfig.entities,
  migrations: typeOrmConfig.migrations
});
