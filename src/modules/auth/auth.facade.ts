import { TokensValue } from "./domain";
import { AuthPort } from "./ports";
import {
  CreateTokensUseCase,
  LoginUseCase,
  LogoutUseCase,
  RefreshTokensUseCase,
  RegisterUseCase,
} from "./usecases";

export class AuthFacade implements AuthPort {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly createTokensUseCase: CreateTokensUseCase,
    private readonly refreshTokensUseCase: RefreshTokensUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  async register(
    id: string,
    pass: string,
    device: string | null,
  ): Promise<TokensValue> {
    const user = await this.registerUseCase.execute(id, pass);
    return await this.createTokensUseCase.execute(user.id, device);
  }

  async login(
    id: string,
    pass: string,
    device: string | null,
  ): Promise<TokensValue | null> {
    const user = await this.loginUseCase.execute(id, pass);
    if (!user) return null;
    return await this.createTokensUseCase.execute(user.id, device);
  }

  async refresh(
    oldRefreshToken: string,
    device: string | null,
  ): Promise<TokensValue> {
    return await this.refreshTokensUseCase.execute(oldRefreshToken, device);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.logoutUseCase.execute(refreshToken);
  }
}
