import { testDataSource } from './src/configs/typeorm.test.config';

beforeAll(async () => {
  await testDataSource.initialize();
});

afterEach(async () => {
  const entities = testDataSource.entityMetadatas;
  const promises = entities.map(async (entity) => {
    const repository = testDataSource.getRepository(entity.name);
    await repository.clear();
  });
  await Promise.all(promises);
});

afterAll(async () => {
  await testDataSource.destroy();
});
