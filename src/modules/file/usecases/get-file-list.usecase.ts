import { IBaseUsecase } from "@common";

import { FileEntity } from "../domain";
import { FileRepositoryPort } from "../ports";

export class GetFileListUseCase implements IBaseUsecase {
  constructor(private readonly fileRepository: FileRepositoryPort) {}

  async execute(
    page: number = 1,
    listSize: number = 10,
  ): Promise<FileEntity[]> {
    const limit = listSize;
    const offset = (page - 1) * listSize;

    return await this.fileRepository.list(limit, offset);
  }
}
