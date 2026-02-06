import * as bcrypt from "bcrypt";

export class PasswordHashingService {
  async hashPassword(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt(10, "b");
    return bcrypt.hash(password, salt);
  }

  async isValidPassword(hashPass: string, pass: string): Promise<boolean> {
    return await bcrypt.compare(pass, hashPass);
  }
}
