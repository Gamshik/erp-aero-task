import { FileEntity } from "../domain";

export abstract class FileRepositoryPort {
  abstract create(file: FileEntity): Promise<void>;
  abstract findById(id: string): Promise<FileEntity | null>;
  abstract delete(id: string): Promise<void>;
  abstract update(id: string, file: FileEntity): Promise<void>;
  abstract list(limit: number, offset: number): Promise<FileEntity[]>;
}
