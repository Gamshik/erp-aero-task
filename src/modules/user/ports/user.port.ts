import { User } from "../domain";

export abstract class UserPort {
  abstract findById(id: string): Promise<User | null>;
  abstract create(id: string, password: string): Promise<User>;
}
