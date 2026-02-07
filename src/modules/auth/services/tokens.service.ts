import { authConfig } from "@config";
import { TokensValue } from "../domain";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import ms from "ms";

export class TokensService {
  generateToken(userId: string, sessionId: string): TokensValue {
    const expiresIn = authConfig.accessTtl;
    const refreshToken = uuidv4();
    const accessToken = jwt.sign(
      { sub: userId, jti: sessionId },
      authConfig.accessSecret,
      {
        expiresIn,
      },
    );
    return new TokensValue(
      accessToken,
      refreshToken,
      ms(expiresIn),
      ms(authConfig.refreshTtl),
    );
  }
}
