import { testDataSource } from './test-config';

export async function initializeTestEnvironment() {
  try {
    await testDataSource.initialize();
    return true;
  } catch (error) {
    console.error('Error initializing test database:', error);
    throw error;
  }
}

export async function cleanupTestEnvironment() {
  try {
    await testDataSource.synchronize(true);
    return true;
  } catch (error) {
    console.error('Error cleaning up test database:', error);
    throw error;
  }
}

export async function closeTestEnvironment() {
  try {
    await testDataSource.destroy();
    return true;
  } catch (error) {
    console.error('Error closing test database:', error);
    throw error;
  }
}
