import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import type { User, UserRole } from '../types';
import { query, execute } from '@/lib/db';

function rowToUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password,
    role: row.role,
    avatar: row.avatar,
    createdAt: row.created_at ? row.created_at.toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? row.updated_at.toISOString() : new Date().toISOString(),
  };
}

export async function getAllUsers(): Promise<Omit<User, 'passwordHash'>[]> {
  const rows = await query<any>('SELECT id, name, email, role, avatar, created_at, updated_at FROM users ORDER BY name ASC');
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    avatar: row.avatar,
    createdAt: row.created_at ? row.created_at.toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? row.updated_at.toISOString() : new Date().toISOString(),
  }));
}

export async function getUserById(id: string): Promise<User | null> {
  const rows = await query<any>('SELECT * FROM users WHERE id = ?', [id]);
  if (rows.length === 0) return null;
  return rowToUser(rows[0]);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const rows = await query<any>('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email]);
  if (rows.length === 0) return null;
  return rowToUser(rows[0]);
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}): Promise<Omit<User, 'passwordHash'>> {
  const id = uuidv4();
  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash(input.password, 12);
  const role = input.role ?? 'author';

  await execute(
    `INSERT INTO users (id, name, email, password, role, avatar, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, NULL, NOW(), NOW())`,
    [id, input.name, input.email.toLowerCase(), passwordHash, role]
  );

  return {
    id,
    name: input.name,
    email: input.email.toLowerCase(),
    role,
    avatar: null,
    createdAt: now,
    updatedAt: now,
  };
}

export async function updateUser(
  id: string,
  input: Partial<{ name: string; email: string; password: string; role: UserRole; avatar: string | null }>
): Promise<Omit<User, 'passwordHash'> | null> {
  const existing = await getUserById(id);
  if (!existing) return null;

  const fields: string[] = [];
  const params: any[] = [];

  if (input.name !== undefined) {
    fields.push('name = ?');
    params.push(input.name);
  }
  if (input.email !== undefined) {
    fields.push('email = ?');
    params.push(input.email.toLowerCase());
  }
  if (input.password !== undefined) {
    const passwordHash = await bcrypt.hash(input.password, 12);
    fields.push('password = ?');
    params.push(passwordHash);
  }
  if (input.role !== undefined) {
    fields.push('role = ?');
    params.push(input.role);
  }
  if (input.avatar !== undefined) {
    fields.push('avatar = ?');
    params.push(input.avatar);
  }

  if (fields.length > 0) {
    fields.push('updated_at = NOW()');
    params.push(id);
    await execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
  }

  const updated = await getUserById(id);
  if (!updated) return null;

  const { passwordHash: _, ...safe } = updated;
  return safe;
}

export async function deleteUser(id: string): Promise<boolean> {
  const result = await execute('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

export async function verifyPassword(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? user : null;
}
