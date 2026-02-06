import { User } from "../domain";

export abstract class UserRepositoryPort {
  abstract findById(id: string): Promise<User | null>;
  abstract create(user: User): Promise<void>;
}
