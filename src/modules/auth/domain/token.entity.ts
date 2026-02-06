export interface TokenProps {
  id?: string;
  userId: string;
  refreshToken: string;
  device: string | null;
  expiresAt: Date;
}

export class Token {
  constructor(private readonly props: TokenProps) {}

  get id(): string | undefined {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get refreshToken(): string {
    return this.props.refreshToken;
  }

  get device(): string | null {
    return this.props.device;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }
}
