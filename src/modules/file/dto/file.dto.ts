export class FileDto {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly extension: string,
    readonly mimeType: string | null,
    readonly size: number | null,
    readonly path: string,
    readonly uploadedAt?: Date,
  ) {}
}
