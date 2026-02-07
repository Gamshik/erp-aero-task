import { IBaseUsecase } from "@common";
import { User, UserPort } from "@user";

import { PasswordHashingService } from "../services";

export class LoginUseCase implements IBaseUsecase {
  constructor(
    private readonly userPort: UserPort,
    private readonly passwordHashingService: PasswordHashingService,
  ) {}

  async execute(id: string, pass: string): Promise<User | null> {
    const user = await this.userPort.findById(id);
    if (!user) return null;
    const isValidPass = await this.passwordHashingService.isValidPassword(
      user.password,
      pass,
    );
    return isValidPass ? user : null;
  }
}
