# Database Setup Guide

This directory contains SQL schema files for the Alumni Management System.

## Files

- **`schema.sql`** - Standard schema file (safe for repeated execution)
- **`schema-workbench.sql`** - Optimized for MySQL Workbench (drops and recreates database)

## Setup Methods

### Method 1: Using MySQL Workbench (Recommended for GUI users)

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open `schema-workbench.sql` file
4. Execute the entire script (Ctrl+Shift+Enter)
5. Verify tables are created by checking the Tables list
6. Run `node scripts/createAdmin.js` to create admin user

### Method 2: Using Command Line

```bash
# Login to MySQL
mysql -u root -p

# Run the schema
source database/schema.sql

# Or directly
mysql -u root -p < database/schema.sql
```

### Method 3: Using Setup Script

```bash
cd backend
npm install
npm run setup-db
```

This will:
- Create the database
- Create all tables
- Handle errors gracefully

## Create Admin User

After setting up the database, create the admin user:

```bash
node scripts/createAdmin.js
```

**Default Admin Credentials:**
- Email: `admin@example.com`
- Password: `admin123`

⚠️ **Change the password after first login!**

## Database Structure

### Tables

1. **users** - User accounts (admin, alumni, student)
2. **alumni_profiles** - Detailed alumni information
3. **events** - Event listings
4. **event_registrations** - Event registration (many-to-many)
5. **job_posts** - Job postings
6. **job_applications** - Job applications
7. **announcements** - System announcements

### Relationships

- `users` 1:1 `alumni_profiles`
- `users` 1:N `events` (as organizer)
- `users` N:M `events` (via event_registrations)
- `users` 1:N `job_posts` (as poster)
- `users` N:M `job_posts` (via job_applications)
- `users` 1:N `announcements` (as poster)

## Troubleshooting

### "Database already exists"
- Use `schema.sql` which uses `CREATE DATABASE IF NOT EXISTS`
- Or manually drop: `DROP DATABASE alumni_management;`

### "Table already exists"
- The schema uses `CREATE TABLE IF NOT EXISTS` so it's safe to run multiple times
- Or drop specific table: `DROP TABLE table_name;`

### "Foreign key constraint fails"
- Make sure tables are created in order
- Check that referenced tables exist before creating foreign keys

### "Access denied"
- Ensure MySQL user has CREATE, DROP, and ALTER privileges
- Grant privileges: `GRANT ALL PRIVILEGES ON alumni_management.* TO 'user'@'localhost';`

## Verification

After setup, verify the database:

```sql
USE alumni_management;
SHOW TABLES;
SELECT COUNT(*) FROM users;
```

You should see 7 tables and 0 users (or 1 if you created admin).
