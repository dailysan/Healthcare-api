import { DataSource } from 'typeorm';

const adminDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: 'postgres',
  logging: false
});

async function createTestDatabase() {
  try {
    console.log('Initializing test database...');
    await adminDataSource.initialize();
    
    const queryRunner = adminDataSource.createQueryRunner();
    
    const databaseExists = await queryRunner.hasDatabase(process.env.TEST_DB_NAME || 'healthcare_test');
    if (!databaseExists) {
      console.log('Creating test database...');
      await queryRunner.createDatabase(process.env.TEST_DB_NAME || 'healthcare_test');
    }
    
    await adminDataSource.destroy();
    console.log('Test database initialized successfully');
  } catch (error) {
    console.error('Error initializing test database:', error);
    process.exit(1);
  }
}

createTestDatabase();
