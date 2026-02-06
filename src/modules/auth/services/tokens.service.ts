import { authConfig } from "@config";
import { TokensValue } from "../domain";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import ms from "ms";

export class TokensService {
  generateToken(userId: string): TokensValue {
    const expiresIn = authConfig.accessTtl;
    const accessToken = jwt.sign({ sub: userId }, authConfig.accessSecret, {
      expiresIn,
    });
    const refreshToken = uuidv4();
    return new TokensValue(accessToken, refreshToken, ms(expiresIn));
  }
}
