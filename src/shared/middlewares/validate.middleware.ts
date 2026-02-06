import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";

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
    } catch (error: any) {
      return res.status(400).json(error.format());
    }
  };
