import { IBaseUsecase } from "@common";

import { FileEntity } from "../domain";
import { FileRepositoryPort } from "../ports";

export class GetFileInfoUseCase implements IBaseUsecase {
  constructor(private readonly fileRepository: FileRepositoryPort) {}

  async execute(id: string): Promise<FileEntity> {
    const file = await this.fileRepository.findById(id);
    if (!file) throw new Error("File not found");
    return file;
  }
}
