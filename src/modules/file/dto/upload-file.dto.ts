export class UploadFileDto {
  constructor(
    readonly userId: string,
    readonly originalname: string,
    readonly mimetype: string,
    readonly size: number,
    readonly filename: string,
  ) {}
}
