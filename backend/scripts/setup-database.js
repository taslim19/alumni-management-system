const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    try {
        // Connect to MySQL without database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        console.log('✅ Connected to MySQL server');

        // Read and execute schema SQL
        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolons and execute each statement
        const statements = schemaSQL
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        for (const statement of statements) {
            if (statement) {
                try {
                    await connection.query(statement);
                } catch (err) {
                    // Ignore errors for existing tables/objects
                    if (!err.message.includes('already exists') && !err.message.includes('Duplicate')) {
                        console.warn('Warning:', err.message);
                    }
                }
            }
        }

        console.log('✅ Database schema created successfully');
        console.log('✅ Default admin user created:');
        console.log('   Email: admin@example.com');
        console.log('   Password: admin123');

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error setting up database:', error.message);
        process.exit(1);
    }
}

setupDatabase();
