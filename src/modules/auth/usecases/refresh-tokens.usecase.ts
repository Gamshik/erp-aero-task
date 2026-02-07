import { IBaseUsecase } from "@common";

import { TokenRepositoryPort } from "../ports";
import { CreateTokensUseCase } from "./create-tokens.usecase";
import { TokensValue } from "../domain";

export class RefreshTokensUseCase implements IBaseUsecase {
  constructor(
    private readonly tokenRepository: TokenRepositoryPort,
    private readonly createTokensUseCase: CreateTokensUseCase,
  ) {}

  async execute(
    oldRefreshToken: string,
    device: string | null,
  ): Promise<TokensValue> {
    const savedToken = await this.tokenRepository.findByToken(oldRefreshToken);

    if (!savedToken) throw new Error("Refresh token not found");

    if (savedToken.expiresAt < new Date()) {
      await this.tokenRepository.deleteByToken(oldRefreshToken);
      throw new Error("Refresh token expired");
    }

    await this.tokenRepository.deleteByToken(oldRefreshToken);

    return await this.createTokensUseCase.execute(savedToken.userId, device);
  }
}
