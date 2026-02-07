// eslint-disable-next-line
/// <reference path="./types/express.d.ts" />

import { appConfig } from "@config";
import { createApp } from "@app";
import { checkDbConnection, initDatabase, pool } from "@db";

async function start() {
  try {
    if (appConfig.env === "development") await initDatabase();

    await checkDbConnection();

    const app = createApp();

    const server = app.listen(appConfig.port, () => {
      console.log(`Server started on port ${appConfig.port}`);
    });

    const shutdown = async (signal: string) => {
      console.log(`${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        await pool.end();
        console.log("Process terminated");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (err) {
    console.error("Failed to start app", err);
    process.exit(1);
  }
}

start().catch((err) => {
  console.error("Failed to start app", err);
});
