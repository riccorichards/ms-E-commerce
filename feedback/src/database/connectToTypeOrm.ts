import { DataSource } from "typeorm";
import config from "../../config";
import Feedbacks from "./entities/feedback.entity";

export const appDataSource = new DataSource({
  host: config.host,
  type: config.orm_type as "postgres",
  port: 5432,
  password: config.password,
  username: config.username,
  database: config.database,
  entities: [Feedbacks],
  synchronize: true,
  dropSchema: false,
  logging: false,
});
