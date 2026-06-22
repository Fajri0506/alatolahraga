const mysql = require('mysql2/promise');

async function checkAdmin() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'db_penyewaan_alat_olahraga'
        });

        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', ['admin@gmail.com']);
        console.log('Admin user found:', rows);
        await connection.end();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkAdmin();
