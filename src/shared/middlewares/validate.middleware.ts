import { Request, Response, NextFunction } from "express";
import { ZodError, ZodObject } from "zod";

export const validateMiddleware =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          details: error.format(),
        });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  };
