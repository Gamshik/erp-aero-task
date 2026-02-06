import mysql from "mysql2/promise";
import { dbEnv } from "./config/dbEnv";
import Knex from "knex";
import knexConfig from "./knexfile";

export async function initDatabase() {
  const connection = await mysql.createConnection({
    host: dbEnv.host,
    user: dbEnv.user,
    password: dbEnv.password,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbEnv.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
  );
  await connection.end();

  const envMode = dbEnv.nodeEnv === "production" ? "production" : "development";

  const knex = Knex(knexConfig[envMode]);

  console.log("Running migrations...");
  await knex.migrate.latest({
    loadExtensions: [".ts", ".js"],
  });
  console.log("Migrations completed");

  return knex;
}
