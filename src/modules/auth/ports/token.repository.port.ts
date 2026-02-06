import { Token } from "../domain";

export abstract class TokenRepositoryPort {
  abstract create(token: Token): Promise<void>;
  abstract findByToken(token: string): Promise<Token | null>;
  abstract deleteByToken(token: string): Promise<void>;
  abstract deleteExpired(): Promise<void>;
}
