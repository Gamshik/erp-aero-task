import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authConfig } from "@config";
import { TokenRepositoryPort } from "@auth";
import { IJwtPayload } from "@common";

export const authMiddleware =
  (tokenRepository: TokenRepositoryPort) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ error: "Unauthorized" });

    const accessToken = authHeader.split(" ")[1] ?? "";

    try {
      const decoded = jwt.verify(
        accessToken,
        authConfig.accessSecret,
      ) as IJwtPayload;

      const session = await tokenRepository.findById(decoded.jti);

      if (!session)
        return res
          .status(401)
          .json({ error: "Session revoked. Please login again." });

      req.user = { id: decoded.sub };
      next();
    } catch (error) {
      return res.status(401).json({ error: "Token expired or invalid" });
    }
  };
