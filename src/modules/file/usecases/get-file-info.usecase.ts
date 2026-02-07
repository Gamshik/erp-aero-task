import { IBaseUsecase } from "@common";
import { FileRepositoryPort } from "../ports";
import { FileEntity } from "../domain";

export class GetFileInfoUseCase implements IBaseUsecase {
  constructor(private readonly fileRepository: FileRepositoryPort) {}

  async execute(id: string): Promise<FileEntity> {
    const file = await this.fileRepository.findById(id);
    if (!file) throw new Error("File not found");
    return file;
  }
}
