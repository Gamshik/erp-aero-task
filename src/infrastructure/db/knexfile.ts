import path from "path";

import { dbEnv } from "./config";

import type { Knex } from "knex";

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
