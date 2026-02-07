import { IBaseUsecase } from "@common";

import { FileRepositoryPort, FileStoragePort } from "../ports";

export class DeleteFileUseCase implements IBaseUsecase {
  constructor(
    private readonly fileRepository: FileRepositoryPort,
    private readonly fileStorage: FileStoragePort,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const file = await this.fileRepository.findById(id);

    if (!file) throw new Error("File not found");

    if (file.userId !== userId) throw new Error("Access denied");

    await this.fileStorage.deleteFile(file.path);
    await this.fileRepository.delete(id);
  }
}
