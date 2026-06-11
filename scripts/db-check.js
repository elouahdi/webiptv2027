const fs = require('fs');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

function loadEnvFile(path) {
  const out = {};
  if (!fs.existsSync(path)) return out;
  const content = fs.readFileSync(path, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const l = line.trim();
    if (!l || l.startsWith('#')) continue;
    const idx = l.indexOf('=');
    if (idx === -1) continue;
    const key = l.slice(0, idx);
    const val = l.slice(idx + 1);
    out[key] = val;
  }
  return out;
}

(async ()=>{
  const env = loadEnvFile('.env.local');
  const host = env.DB_HOST || '127.0.0.1';
  const port = Number(env.DB_PORT || 3306);
  const user = env.DB_USER || 'root';
  const password = env.DB_PASSWORD || '';
  const database = env.DB_NAME || 'cms_db';

  console.log('Connecting to MySQL', { host, port, user, database });
  const pool = mysql.createPool({ host, port, user, password, database, waitForConnections:true, connectionLimit:2 });
  try {
    const [rows] = await pool.execute('SELECT id, name, email, password, role, status FROM users WHERE email = ?', ['admin@regardez-iptv.fr']);
    if (!rows || rows.length === 0) {
      console.log('Admin user not found');
      process.exit(0);
    }
    const u = rows[0];
    console.log('User row:', u);
    const ok = await bcrypt.compare('admin123', u.password);
    console.log('bcrypt compare with admin123 ->', ok);
  } catch (e) {
    console.error('DB error', e);
  } finally {
    await pool.end();
  }
})();
