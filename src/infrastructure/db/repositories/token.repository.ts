import { TokenRepositoryPort, Token } from "@modules/auth"; // через алиас
import { pool } from "../mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class TokenRepository implements TokenRepositoryPort {
  async create(token: Token): Promise<void> {
    const result = await pool.execute<ResultSetHeader>(
      `INSERT INTO tokens (id, userId, refreshToken, device, expiresAt) 
       VALUES (UUID(), ?, ?, ?, ?)`,
      [token.userId, token.refreshToken, token.device, token.expiresAt],
    );

    if (result[0].affectedRows === 0)
      throw new Error("Token session not created");
  }

  async findByToken(token: string): Promise<Token | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM tokens WHERE refreshToken = ? LIMIT 1",
      [token],
    );

    const row = rows[0];

    if (!row) return null;

    return new Token({
      id: row.id,
      userId: row.userId,
      refreshToken: row.refreshToken,
      device: row.device,
      expiresAt: new Date(row.expiresAt),
    });
  }

  async deleteByToken(token: string): Promise<void> {
    await pool.execute("DELETE FROM tokens WHERE refreshToken = ?", [token]);
  }

  async deleteExpired(): Promise<void> {
    await pool.execute("DELETE FROM tokens WHERE expiresAt < NOW()");
  }
}
