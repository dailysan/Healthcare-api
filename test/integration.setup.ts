import { DataSource } from 'typeorm';
import { dataSource } from '../src/configs/typeorm.datasource';

export const initializeTestDatabase = async () => {
  await dataSource.initialize();
  return dataSource;
};

export const cleanupTestDatabase = async () => {
  const entities = dataSource.entityMetadatas;
  const promises = entities.map(async (entity) => {
    const repository = dataSource.getRepository(entity.name);
    await repository.clear();
  });
  await Promise.all(promises);
};

export const closeTestDatabase = async () => {
  await dataSource.destroy();
};
