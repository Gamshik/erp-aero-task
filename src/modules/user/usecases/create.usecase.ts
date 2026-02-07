import { IBaseUsecase } from "@common";

import { User } from "../domain";
import { UserRepositoryPort } from "../ports";

export class CreateUseCase implements IBaseUsecase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(user: User): Promise<User> {
    await this.userRepository.create(user);
    return user;
  }
}
