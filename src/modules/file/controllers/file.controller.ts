import { Request, Response } from "express";

import { FilePort, FileStoragePort } from "../ports";

export class FileController {
  constructor(
    private readonly filePort: FilePort,
    private readonly fileStoragePort: FileStoragePort,
  ) {}

  public upload = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      if (!req.user) throw new Error("Internal server error");
      const userId = req.user.id;

      const file = await this.filePort.upload({
        userId,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        filename: req.file.filename,
      });

      res.status(201).json(file);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res.status(500).json({ error: message });
    }
  };

  public list = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const listSize = parseInt(req.query.list_size as string) || 10;

      const files = await this.filePort.list(page, listSize);
      res.status(200).json(files);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res.status(500).json({ error: message });
    }
  };

  public getInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      if (typeof id !== "string" || !id) throw new Error("Url is incorrect");

      const file = await this.filePort.getInfo(id);
      res.status(200).json(file);
    } catch {
      res.status(404).json({ error: "File not found" });
    }
  };

  public download = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      if (typeof id !== "string" || !id) throw new Error("Url is incorrect");

      const file = await this.filePort.getInfo(id);
      const absolutePath = this.fileStoragePort.getAbsolutePath(file.path);

      res.download(absolutePath, file.name);
    } catch {
      res.status(404).json({ error: "File not found" });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      if (typeof id !== "string" || !id) throw new Error("Url is incorrect");

      if (!req.user) throw new Error("Internal server error");
      const userId = req.user.id;

      await this.filePort.delete(id, userId);
      res.status(200).json({ message: "File deleted successfully" });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res.status(500).json({ error: message });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No new file provided" });
        return;
      }

      const id = req.params.id;
      if (typeof id !== "string" || !id) throw new Error("Url is incorrect");

      if (!req.user) throw new Error("Internal server error");
      const userId = req.user.id;

      const updatedFile = await this.filePort.update(id, {
        userId,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        filename: req.file.filename,
      });

      res.status(200).json(updatedFile);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res.status(500).json({ error: message });
    }
  };
}
