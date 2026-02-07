import { IBaseValue } from "@common";

export class TokensValue implements IBaseValue {
  constructor(
    readonly accessToken: string,
    readonly refreshToken: string,
    readonly accessTokenExpiresIn: number,
    readonly refreshTokenExpiresIn: number,
  ) {}

  equals(other: TokensValue): boolean {
    return (
      this.accessToken === other.accessToken &&
      this.refreshToken === other.refreshToken &&
      this.accessTokenExpiresIn === other.accessTokenExpiresIn &&
      this.refreshTokenExpiresIn === other.refreshTokenExpiresIn
    );
  }
}
