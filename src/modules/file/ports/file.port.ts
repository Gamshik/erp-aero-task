import { FileDto, UploadFileDto } from "../dto";

export abstract class FilePort {
  abstract upload(dto: UploadFileDto): Promise<FileDto>;
  abstract list(page?: number, listSize?: number): Promise<FileDto[]>;
  abstract getInfo(id: string): Promise<FileDto>;
  abstract delete(id: string, userId: string): Promise<void>;
  abstract update(id: string, dto: UploadFileDto): Promise<FileDto>;
}
