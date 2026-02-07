import { IBaseValidator } from "@common";
import { UserRepositoryPort } from "@user";

export class RegisterValidator implements IBaseValidator {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async validate(id: string): Promise<void> {
    const existing = await this.userRepository.findById(id);
    if (existing) throw new Error("User already exists");
  }
}
