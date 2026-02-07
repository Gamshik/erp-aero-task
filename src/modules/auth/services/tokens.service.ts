import { IJwtPayload } from "@common";
import { authConfig } from "@config";
import jwt from "jsonwebtoken";
import ms from "ms";
import { v4 as uuidv4 } from "uuid";

import { TokensValue } from "../domain";

export class TokensService {
  generateToken(userId: string, sessionId: string): TokensValue {
    const expiresIn = authConfig.accessTtl;
    const refreshToken = uuidv4();
    const payload: IJwtPayload = { sub: userId, jti: sessionId };
    const accessToken = jwt.sign(payload, authConfig.accessSecret, {
      expiresIn,
    });
    return new TokensValue(
      accessToken,
      refreshToken,
      ms(expiresIn),
      ms(authConfig.refreshTtl),
    );
  }
}
