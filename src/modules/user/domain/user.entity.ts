import { EMAIL_REGEX, PHONE_REGEX } from "@utils";

export interface UserProps {
  id: string;
  password: string;
}

export class User {
  constructor(private readonly props: UserProps) {}

  get id(): string {
    return this.props.id;
  }

  get password(): string {
    return this.props.password;
  }

  public static isValidIdentifier(id: string): boolean {
    return EMAIL_REGEX.test(id) || PHONE_REGEX.test(id);
  }
}
