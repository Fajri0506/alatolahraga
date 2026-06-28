const { Pool } = require('pg');
const dns = require('dns');
require('dotenv').config();

// Force Node.js to prefer IPv4 over IPv6 when resolving DNS
// This fixes ENOTFOUND errors on networks that don't support IPv6
dns.setDefaultResultOrder('ipv4first');

// Parse DATABASE_URL manually to handle Supabase pooler usernames with dots
// (e.g., "postgres.projectref") which pg's URL parser mishandles
function parseSupabaseUrl(connectionString) {
  try {
    const url = new URL(connectionString);
    return {
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      database: url.pathname.replace(/^\//, ''),
      ssl: { rejectUnauthorized: false }
    };
  } catch (e) {
    // Fallback to connectionString if parsing fails
    return {
      connectionString,
      ssl: { rejectUnauthorized: false }
    };
  }
}

const poolConfig = parseSupabaseUrl(process.env.DATABASE_URL);
const pool = new Pool(poolConfig);

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected to Supabase successfully!');
    release();
  }
});

const wrappedPool = {
  execute: async (text, params) => {
    const res = await pool.query(text, params);
    res.rows.affectedRows = res.rowCount;
    return [res.rows, res.fields];
  },
  query: async (text, params) => {
    const res = await pool.query(text, params);
    res.rows.affectedRows = res.rowCount;
    return [res.rows, res.fields];
  },
  getConnection: async () => {
    const client = await pool.connect();
    return {
      query: async (text, params) => {
        const res = await client.query(text, params);
        res.rows.affectedRows = res.rowCount;
        return [res.rows, res.fields];
      },
      beginTransaction: async () => client.query('BEGIN'),
      commit: async () => client.query('COMMIT'),
      rollback: async () => client.query('ROLLBACK'),
      release: () => client.release()
    };
  },
  pool: pool
};

module.exports = wrappedPool;
