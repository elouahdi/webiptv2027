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

  const pool = mysql.createPool({ host, port, user, password, database, waitForConnections:true, connectionLimit:2 });
  try {
    const newHash = await bcrypt.hash('admin123', 12);
    console.log('Updating admin password hash to:', newHash);
    const [res] = await pool.execute('UPDATE users SET password = ? WHERE email = ?', [newHash, 'admin@regardez-iptv.fr']);
    console.log('Update result:', res);
  } catch (e) {
    console.error('Error', e);
  } finally {
    await pool.end();
  }
})();
