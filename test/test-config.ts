import { DataSource } from 'typeorm';

export const testDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.TEST_DB_NAME || 'healthcare_test',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: true,
  dropSchema: true,
  logging: false,
  name: 'test'
});

export async function initializeTestDatabase() {
  try {
    await testDataSource.initialize();
    await testDataSource.runMigrations();
    return true;
  } catch (error) {
    console.error('Error initializing test database:', error);
    throw error;
  }
}

export async function cleanupTestDatabase() {
  try {
    console.log('Cleaning up test database...');
    const entities = testDataSource.entityMetadatas;
    const promises = entities.map(async (entity) => {
      const repository = testDataSource.getRepository(entity.name);
      await repository.clear();
    });
    await Promise.all(promises);
    console.log('Test database cleaned up successfully');
  } catch (error) {
    console.error('Error cleaning up test database:', error);
    throw error;
  }
}

export async function closeTestDatabase() {
  try {
    console.log('Closing test database connection...');
    await testDataSource.destroy();
    console.log('Test database connection closed successfully');
  } catch (error) {
    console.error('Error closing test database:', error);
    throw error;
  }
}
