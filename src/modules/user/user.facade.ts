import { User } from "./domain";
import { UserPort, UserRepositoryPort } from "./ports";
import { CreateUseCase } from "./usecases";

export class UserFacade implements UserPort {
  constructor(
    private readonly userRepositoryPort: UserRepositoryPort,
    private readonly createUseCase: CreateUseCase,
  ) {}

  async findById(id: string): Promise<User | null> {
    return await this.userRepositoryPort.findById(id);
  }

  async create(id: string, password: string): Promise<User> {
    const user = new User({ id, password });
    return await this.createUseCase.execute(user);
  }
}
