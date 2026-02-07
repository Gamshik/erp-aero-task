export interface FileProps {
  id: string;
  userId: string;
  name: string;
  extension: string;
  mimeType: string | null;
  size: number | null;
  path: string;
  uploadedAt?: Date;
}

export class FileEntity {
  constructor(private readonly props: FileProps) {}

  get id(): string {
    return this.props.id;
  }
  get userId(): string {
    return this.props.userId;
  }
  get name(): string {
    return this.props.name;
  }
  get extension(): string {
    return this.props.extension;
  }
  get mimeType(): string | null {
    return this.props.mimeType;
  }
  get size(): number | null {
    return this.props.size;
  }
  get path(): string {
    return this.props.path;
  }
  get uploadedAt(): Date | undefined {
    return this.props.uploadedAt;
  }
}
