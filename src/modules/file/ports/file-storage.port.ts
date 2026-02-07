export abstract class FileStoragePort {
  abstract deleteFile(filename: string): Promise<void>;
  abstract getAbsolutePath(filename: string): string;
}
