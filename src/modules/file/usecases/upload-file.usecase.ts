import { FileRepositoryPort } from "../ports";
import { FileEntity } from "../domain";
import { v4 as uuidv4 } from "uuid";
import { IBaseUsecase } from "@common";
import { UploadFileDto } from "../dto";
import path from "path";

export class UploadFileUseCase implements IBaseUsecase {
  constructor(private readonly fileRepository: FileRepositoryPort) {}

  async execute(dto: UploadFileDto): Promise<FileEntity> {
    const file = new FileEntity({
      id: uuidv4(),
      userId: dto.userId,
      name: dto.originalname,
      extension: path.extname(dto.originalname),
      mimeType: dto.mimetype,
      size: dto.size,
      path: dto.filename,
      uploadedAt: new Date(),
    });

    await this.fileRepository.create(file);
    return file;
  }
}
