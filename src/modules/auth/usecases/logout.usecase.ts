import { IBaseUsecase } from "@common";
import { TokenRepositoryPort } from "../ports";

export class LogoutUseCase implements IBaseUsecase {
  constructor(private readonly tokenRepository: TokenRepositoryPort) {}

  async execute(refreshToken: string): Promise<void> {
    await this.tokenRepository.deleteByToken(refreshToken);
  }
}
