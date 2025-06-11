import { testDataSource } from './test-config';

beforeAll(async () => {
  try {
    await testDataSource.initialize();
  } catch (error) {
    console.error('Error initializing test database:', error);
    throw error;
  }
}, 30000);

afterEach(async () => {
  try {
    await testDataSource.synchronize(true);
  } catch (error) {
    console.error('Error cleaning up test database:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await testDataSource.destroy();
  } catch (error) {
    console.error('Error closing test database:', error);
    throw error;
  }
});
