import path from "path";
import type { Knex } from "knex";
import { dbEnv } from "./config";

const baseConfig: Knex.Config = {
  client: "mysql2",
  connection: {
    host: dbEnv.host,
    user: dbEnv.user,
    password: dbEnv.password,
    database: dbEnv.database,
  },
  migrations: {
    directory: path.resolve(__dirname, "migrations"),
    extension: "js",
  },
};

export default {
  development: baseConfig,
  production: baseConfig,
};
