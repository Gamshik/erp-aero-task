import mysql from "mysql2/promise";
import { dbEnv } from "./config/dbEnv";

export const pool = mysql.createPool({
  host: dbEnv.host,
  user: dbEnv.user,
  password: dbEnv.password,
  database: dbEnv.database,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  dateStrings: true,
});

export async function checkDbConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Database connected");
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}
