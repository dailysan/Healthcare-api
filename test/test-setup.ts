import { testDataSource } from './test-config';

export async function initializeTestEnvironment() {
  try {
    console.log('Initializing test database...');
    await testDataSource.initialize();
    console.log('Test database initialized successfully');
  } catch (error) {
    console.error('Error initializing test database:', error);
    throw error;
  }
}

export async function cleanupTestEnvironment() {
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

export async function closeTestEnvironment() {
  try {
    console.log('Closing test database connection...');
    await testDataSource.destroy();
    console.log('Test database connection closed successfully');
  } catch (error) {
    console.error('Error closing test database:', error);
    throw error;
  }
}
