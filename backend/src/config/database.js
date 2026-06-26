const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
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
