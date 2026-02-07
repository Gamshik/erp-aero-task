import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileConfig } from "@config";
import fs from "fs";

const uploadDir = path.resolve(process.cwd(), fileConfig.uploadFolder);

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});
