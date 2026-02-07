import { fileConfig } from "@config";
import { FileStoragePort } from "@file";
import fs from "fs/promises";
import path from "path";

export class FileStorageService implements FileStoragePort {
  private readonly uploadDir = path.resolve(
    process.cwd(),
    fileConfig.uploadFolder,
  );

  async deleteFile(filename: string): Promise<void> {
    const filePath = path.join(this.uploadDir, filename);
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
    } catch {
      console.warn(
        `File ${filename} not found on disk, skipping physical delete.`,
      );
    }
  }

  getAbsolutePath(filename: string): string {
    return path.join(this.uploadDir, filename);
  }
}
