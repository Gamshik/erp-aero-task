import { Request, Response } from "express";
import { AuthPort } from "../ports";

export class AuthController {
  constructor(private authPort: AuthPort) {}

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, password } = req.body;
      const device = req.headers["user-agent"] || "unknown";

      console.log("device", device);

      const tokens = await this.authPort.register(id, password, device);

      res.status(201).json(tokens);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
