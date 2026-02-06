import { StringValue } from "ms";
import { z } from "zod";

export interface IAuthConfig {
  accessSecret: string;
  refreshSecret: string;
  accessTtl: StringValue;
  refreshTtl: StringValue;
}

const authConfigSchema = z.object({
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
});

const parsed = authConfigSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid auth config variables", parsed.error.message);
  process.exit(1);
}

export const authConfig: IAuthConfig = {
  accessSecret: parsed.data.JWT_SECRET,
  refreshSecret: parsed.data.JWT_REFRESH_SECRET,
  accessTtl: "10m",
  refreshTtl: "7d",
};
