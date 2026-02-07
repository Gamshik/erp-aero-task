import { TokensValue } from "../domain";

export abstract class AuthPort {
  abstract register(
    id: string,
    pass: string,
    device: string | null,
  ): Promise<TokensValue>;

  abstract login(
    id: string,
    pass: string,
    device: string | null,
  ): Promise<TokensValue | null>;

  abstract refresh(
    oldRefreshToken: string,
    device: string | null,
  ): Promise<TokensValue>;

  abstract logout(refreshToken: string): Promise<void>;
}
