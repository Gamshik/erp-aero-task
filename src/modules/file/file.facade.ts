import { FileDto, UploadFileDto } from "./dto";
import { FileMapper } from "./mappers";
import { FilePort } from "./ports";
import {
  UploadFileUseCase,
  GetFileListUseCase,
  GetFileInfoUseCase,
  DeleteFileUseCase,
  UpdateFileUseCase,
} from "./usecases";

export class FileFacade implements FilePort {
  constructor(
    private readonly uploadUseCase: UploadFileUseCase,
    private readonly listUseCase: GetFileListUseCase,
    private readonly infoUseCase: GetFileInfoUseCase,
    private readonly deleteUseCase: DeleteFileUseCase,
    private readonly updateUseCase: UpdateFileUseCase,
    private readonly fileMapper: FileMapper,
  ) {}

  async upload(dto: UploadFileDto): Promise<FileDto> {
    const file = await this.uploadUseCase.execute(dto);
    return this.fileMapper.toDto(file);
  }

  async list(page?: number, listSize?: number): Promise<FileDto[]> {
    const files = await this.listUseCase.execute(page, listSize);
    return this.fileMapper.toDtos(files);
  }

  async getInfo(id: string): Promise<FileDto> {
    const file = await this.infoUseCase.execute(id);
    return this.fileMapper.toDto(file);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.deleteUseCase.execute(id, userId);
  }

  async update(id: string, dto: UploadFileDto): Promise<FileDto> {
    const file = await this.updateUseCase.execute(id, dto);
    return this.fileMapper.toDto(file);
  }
}
