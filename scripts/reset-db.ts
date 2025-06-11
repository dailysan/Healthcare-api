import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../src/configs/typeorm.config';

const dataSource = new DataSource({
  ...typeOrmConfig,
  synchronize: true,
  dropSchema: true,
  logging: true,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});

async function resetDatabase() {
  try {
    console.log('Starting database reset...');
    await dataSource.initialize();
    console.log('Database reset completed successfully');
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

resetDatabase();
