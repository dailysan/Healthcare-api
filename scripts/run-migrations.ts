import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../src/configs/typeorm.config';

const dataSource = new DataSource({
  ...typeOrmConfig,
  synchronize: false,
  migrations: ['src/migrations/*.ts'],
  entities: ['src/**/*.entity.ts'],
});

async function runMigrations() {
  try {
    await dataSource.initialize();
    await dataSource.runMigrations();
    console.log('Migrations executed successfully');
  } catch (error) {
    console.error('Error executing migrations:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

runMigrations();
