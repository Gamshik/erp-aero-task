import path from "path";

import dotenv from "dotenv";
import { z } from "zod";

const envFile = process.env.DOTENV_CONFIG_PATH || ".env.development";

const baseDir = process.env.INIT_CWD || process.cwd();
const envPath = path.resolve(baseDir, envFile);

dotenv.config({ path: envPath });

const dbEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
});

const parsed = dbEnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid DB environment variables", parsed.error.format());
  process.exit(1);
}

export const dbEnv = {
  nodeEnv: parsed.data.NODE_ENV,
  host: parsed.data.DB_HOST,
  user: parsed.data.DB_USER,
  password: parsed.data.DB_PASSWORD,
  database: parsed.data.DB_NAME,
};
