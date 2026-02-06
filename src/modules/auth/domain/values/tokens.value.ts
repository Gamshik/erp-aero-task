import { IBaseValue } from "@common";

export class TokensValue implements IBaseValue {
  constructor(
    readonly accessToken: string,
    readonly refreshToken: string,
    readonly expiresIn: number,
  ) {}

  equals(other: TokensValue): boolean {
    return (
      this.accessToken === other.accessToken &&
      this.refreshToken === other.refreshToken &&
      this.expiresIn === other.expiresIn
    );
  }
}
