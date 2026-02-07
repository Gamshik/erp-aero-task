import { appConfig } from "@config";
import { Request, Response } from "express";

import { TokensValue } from "../domain";
import { AuthPort } from "../ports";

export class AuthController {
  constructor(private authPort: AuthPort) {}

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, password } = req.body;
      const device = this.getRequestAgent(req);

      const tokens = await this.authPort.register(id, password, device);

      this.setRefreshCookie(res, tokens);
      this.sendTokensResponse(res, tokens);
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, password } = req.body;
      const device = this.getRequestAgent(req);

      const tokens = await this.authPort.login(id, password, device);

      if (!tokens) {
        res.status(401).json({ error: "Invalid id or password" });
        return;
      }

      this.setRefreshCookie(res, tokens);
      this.sendTokensResponse(res, tokens);
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public refresh = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
      const device = this.getRequestAgent(req);

      if (!refreshToken) {
        res.status(401).json({ error: "No refresh token provided" });
        return;
      }

      const tokens = await this.authPort.refresh(refreshToken, device);

      this.setRefreshCookie(res, tokens);
      this.sendTokensResponse(res, tokens);
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

      if (refreshToken) await this.authPort.logout(refreshToken);

      res.clearCookie("refreshToken");
      res.status(200).json({ message: "Logged out successfully" });
    } catch {
      res.status(404).json({ error: "Invalid refresh token" });
    }
  };

  public info = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new Error("Internal server error");
    const userId = req.user.id;
    res.status(200).json({ id: userId });
  };

  private getRequestAgent(req: Request): string {
    return req.headers["user-agent"] || "unknown";
  }

  private setRefreshCookie(res: Response, tokens: TokensValue): void {
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: appConfig.env === "production",
      sameSite: "strict",
      maxAge: tokens.refreshTokenExpiresIn,
    });
  }

  private sendTokensResponse(res: Response, tokens: TokensValue): void {
    res.status(200).json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.accessTokenExpiresIn,
    });
  }
}
