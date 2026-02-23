import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Todo } from './entity/Todo';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: false,
  entities: [Todo],
  migrations: [],
  subscribers: [],
});
