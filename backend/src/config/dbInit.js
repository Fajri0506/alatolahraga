const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function initDB() {
  const dbName = process.env.DB_NAME || 'db_penyewaan_alat_olahraga';
  
  console.log(`Connecting to MySQL server at ${process.env.DB_HOST || 'localhost'}...`);
  
  // Connect to MySQL server without database first
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  });
  
  console.log('Connected to MySQL server.');
  
  // Create database
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
  console.log(`Database '${dbName}' verified/created.`);
  
  // Use the database
  await connection.query(`USE \`${dbName}\`;`);
  
  // Read database.sql
  const sqlPath = path.join(__dirname, '../../database.sql');
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');
  
  // Split queries by semicolon and execute each
  const queries = sqlContent
    .split(';')
    .map(q => q.trim())
    .filter(q => q.length > 0);
    
  console.log(`Executing ${queries.length} SQL commands from database.sql...`);
  for (let query of queries) {
    const lowerQuery = query.toLowerCase();
    // Skip USE database commands in sql since we did it manually
    if (lowerQuery.startsWith('use ') || lowerQuery.startsWith('create database ')) {
      continue;
    }
    try {
      await connection.query(query);
    } catch (e) {
      console.error(`Error executing query: ${query.substring(0, 100)}...`);
      console.error(e.message);
      throw e;
    }
  }
  console.log('SQL Schema and seed categories imported successfully.');
  
  // Create default admin and user if not exists
  const [users] = await connection.query('SELECT * FROM users LIMIT 1');
  if (users.length === 0) {
    console.log('No users found. Seeding default users (admin & penyewa)...');
    
    const adminHash = await bcrypt.hash('admin123', 10);
    const userHash = await bcrypt.hash('user123', 10);
    
    await connection.query(
      `INSERT INTO users (nama, email, password, no_hp, alamat, role) VALUES 
       (?, ?, ?, ?, ?, ?),
       (?, ?, ?, ?, ?, ?)`,
      [
        'Administrator', 'admin@gmail.com', adminHash, '081234567890', 'Kantor Admin', 'admin',
        'Budi Penyewa', 'penyewa@gmail.com', userHash, '089876543210', 'Jl. Olahraga No. 10', 'penyewa'
      ]
    );
    console.log('Default users seeded:');
    console.log(' - Admin: admin@gmail.com / admin123');
    console.log(' - Penyewa: penyewa@gmail.com / user123');
  }
  
  await connection.end();
  console.log('Database initialization completed.');
}

initDB().catch(err => {
  console.error('Database initialization failed:', err);
  process.exit(1);
});
