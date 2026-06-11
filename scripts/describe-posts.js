const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 8889,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'cms_db',
    });

    const [rows] = await conn.query("SELECT COLUMN_NAME, ORDINAL_POSITION FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'posts' ORDER BY ORDINAL_POSITION", [process.env.DB_NAME || 'cms_db']);
    console.log('posts table columns (in order):');
    rows.forEach((r) => console.log(`${r.ORDINAL_POSITION}: ${r.COLUMN_NAME}`));
    await conn.end();
  } catch (err) {
    console.error('Error describing posts table:', err);
    process.exit(1);
  }
})();
