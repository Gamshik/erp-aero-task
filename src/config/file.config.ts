import { z } from "zod";

export interface IFileConfig {
  uploadFolder: string;
}

const fileConfigSchema = z.object({
  UPLOAD_FOLDER: z.string(),
});

const parsed = fileConfigSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid file config variables", parsed.error.message);
  process.exit(1);
}

export const fileConfig: IFileConfig = {
  uploadFolder: parsed.data.UPLOAD_FOLDER,
};
