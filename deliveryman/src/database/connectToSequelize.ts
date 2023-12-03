import { Sequelize } from "sequelize";
import config from "../../config";
import log from "../utils/logger";
import { setupAssociation } from "./associations";

const dbName = config.dbName!;
const dbUser = config.dbUser!;
const dbPassword = config.dbPassword!;

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: config.dbHost,
  dialect: config.dbDialect as any,
  logging: false,
});

export const connectToMySQL = async () => {
  try {
    await sequelize.authenticate();
    log.info("Connection to the database has been established successfully.");
    setupAssociation();
    await sequelize.sync({ force: false });
  } catch (error: any) {
    log.error({ err: error.message });
  }
};
