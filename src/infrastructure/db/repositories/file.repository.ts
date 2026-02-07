import { FileEntity, FileRepositoryPort } from "@file";
import { pool } from "../mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class FileRepository implements FileRepositoryPort {
  async create(file: FileEntity): Promise<void> {
    await pool.execute<ResultSetHeader>(
      `INSERT INTO files (id, userId, name, extension, mimeType, size, path, uploadedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        file.id,
        file.userId,
        file.name,
        file.extension,
        file.mimeType,
        file.size,
        file.path,
        file.uploadedAt || new Date(),
      ],
    );
  }

  async findById(id: string): Promise<FileEntity | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM files WHERE id = ? LIMIT 1",
      [id],
    );

    if (!rows[0]) return null;
    return this.mapToEntity(rows[0]);
  }

  async delete(id: string): Promise<void> {
    await pool.execute("DELETE FROM files WHERE id = ?", [id]);
  }

  async update(id: string, file: FileEntity): Promise<void> {
    await pool.execute<ResultSetHeader>(
      `UPDATE files SET 
        name = ?, extension = ?, mimeType = ?, size = ?, path = ?, uploadedAt = ? 
       WHERE id = ?`,
      [
        file.name,
        file.extension,
        file.mimeType,
        file.size,
        file.path,
        new Date(),
        id,
      ],
    );
  }

  async list(limit: number, offset: number): Promise<FileEntity[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM files ORDER BY uploadedAt DESC LIMIT ? OFFSET ?",
      [limit.toString(), offset.toString()],
    );

    return rows.map((row) => this.mapToEntity(row));
  }

  private mapToEntity(row: RowDataPacket): FileEntity {
    return new FileEntity({
      id: row.id,
      userId: row.userId,
      name: row.name,
      extension: row.extension,
      mimeType: row.mimeType,
      size: Number(row.size),
      path: row.path,
      uploadedAt: new Date(row.uploadedAt),
    });
  }
}
