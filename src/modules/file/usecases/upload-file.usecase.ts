import path from "path";

import { IBaseUsecase } from "@common";
import { v4 as uuidv4 } from "uuid";

import { FileEntity } from "../domain";
import { UploadFileDto } from "../dto";
import { FileRepositoryPort } from "../ports";



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
