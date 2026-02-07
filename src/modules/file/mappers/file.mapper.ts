import { FileEntity } from "../domain";
import { FileDto } from "../dto";

export class FileMapper {
  toDto(file: FileEntity): FileDto {
    return new FileDto(
      file.id,
      file.name,
      file.extension,
      file.mimeType,
      file.size,
      file.path,
      file.uploadedAt,
    );
  }

  toDtos(files: FileEntity[]): FileDto[] {
    return files.map((f) => this.toDto(f));
  }
}
