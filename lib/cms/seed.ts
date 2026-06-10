import { createUser } from './repositories/users';

// Seeding is now handled by the migration script
// This file is kept for backward compatibility but is a no-op
export async function seedCMSIfEmpty(): Promise<void> {
  // Check if admin user exists in MySQL
  const db = (await import('@/lib/db')).default;
  const [existing] = await db.query('SELECT COUNT(*) as count FROM users WHERE email = ?', ['admin@regardez-iptv.fr']);
  const count = (existing as any)[0].count;
  
  if (count > 0) {
    return; // Admin user already exists
  }

  // Create default admin user
  await createUser({
    name: 'Administrateur',
    email: 'admin@regardez-iptv.fr',
    password: 'admin123',
    role: 'admin',
  });
}
