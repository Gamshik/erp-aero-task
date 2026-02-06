import { IBaseUsecase } from "@common";
import { User, UserPort } from "@user";
import { RegisterValidator } from "../validators";
import { PasswordHashingService } from "../services";

export class RegisterUseCase implements IBaseUsecase {
  constructor(
    private readonly userPort: UserPort,
    private readonly passwordHashingService: PasswordHashingService,
    private readonly registerValidator: RegisterValidator,
  ) {}

  async execute(id: string, pass: string): Promise<User> {
    await this.registerValidator.validate(id);
    const hashPass = await this.passwordHashingService.hashPassword(pass);
    return await this.userPort.create(id, hashPass);
  }
}
