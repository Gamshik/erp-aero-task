import { IBaseUsecase } from "@common";
import { TokensService } from "../services";
import { TokenRepositoryPort } from "../ports";
import { Token, TokensValue } from "../domain";
import { authConfig } from "@config";
import { v4 as uuidv4 } from "uuid";
import ms from "ms";

export class CreateTokensUseCase implements IBaseUsecase {
  constructor(
    private readonly tokenRepository: TokenRepositoryPort,
    private readonly tokensService: TokensService,
  ) {}

  async execute(userId: string, device: string | null): Promise<TokensValue> {
    const sessionId = uuidv4();
    const tokens = this.tokensService.generateToken(userId, sessionId);
    await this.tokenRepository.create(
      new Token({
        id: sessionId,
        userId: userId,
        refreshToken: tokens.refreshToken,
        device: device,
        expiresAt: new Date(Date.now() + ms(authConfig.refreshTtl)),
      }),
    );
    return tokens;
  }
}
