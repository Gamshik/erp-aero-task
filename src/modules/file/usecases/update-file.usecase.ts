import path from "path";

import { IBaseUsecase } from "@common";

import { FileEntity } from "../domain";
import { UploadFileDto } from "../dto";
import { FileRepositoryPort, FileStoragePort } from "../ports";

export class UpdateFileUseCase implements IBaseUsecase {
  constructor(
    private readonly fileRepository: FileRepositoryPort,
    private readonly fileStorage: FileStoragePort,
  ) {}

  async execute(id: string, dto: UploadFileDto): Promise<FileEntity> {
    const oldFile = await this.fileRepository.findById(id);
    if (!oldFile) throw new Error("File not found");

    if (oldFile.userId !== dto.userId) throw new Error("Access denied");

    await this.fileStorage.deleteFile(oldFile.path);

    const updatedFile = new FileEntity({
      id: id,
      userId: dto.userId,
      name: dto.originalname,
      extension: path.extname(dto.originalname),
      mimeType: dto.mimetype,
      size: dto.size,
      path: dto.filename,
      uploadedAt: new Date(),
    });

    await this.fileRepository.update(id, updatedFile);
    return updatedFile;
  }
}
