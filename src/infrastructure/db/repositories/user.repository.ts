import { UserRepositoryPort, User } from "@user";
import { pool } from "../mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class UserRepository implements UserRepositoryPort {
  async findById(id: string): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT id, password FROM users WHERE id = ?",
      [id],
    );

    const row = rows[0];

    if (!row) return null;

    return new User({
      id: row.id,
      password: row.password,
    });
  }

  async create(user: User): Promise<void> {
    const result = await pool.execute<ResultSetHeader>(
      "INSERT INTO users (id, password) VALUES (?, ?)",
      [user.id, user.password],
    );

    if (result[0].affectedRows === 0) throw new Error("User not created");
  }
}
