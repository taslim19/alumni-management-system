# MySQL Setup Guide

## Prerequisites

1. **Install MySQL Server**
   - Windows: Download from [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)
   - Linux: `sudo apt install mysql-server`
   - Mac: `brew install mysql`

2. **Start MySQL Service**
   ```bash
   # Linux/Mac
   sudo systemctl start mysql
   # or
   sudo service mysql start
   
   # Windows: Start MySQL service from Services
   ```

## Setup Steps

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Database

Create/update `.env` file:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=alumni_management
DB_USER=root
DB_PASSWORD=your_mysql_password
```

### 3. Create Database and Tables

**Option A: Using the setup script (Recommended)**

```bash
npm run setup-db
```

**Option B: Manual setup**

```bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source database/schema.sql

# Or copy and paste the contents of database/schema.sql
```

### 4. Verify Setup

```bash
# Login to MySQL
mysql -u root -p

# Check database
USE alumni_management;
SHOW TABLES;

# Check admin user
SELECT * FROM users WHERE email = 'admin@example.com';
```

### 5. Start Backend Server

```bash
npm run dev
```

## Default Admin Credentials

- **Email:** `admin@example.com`
- **Password:** `admin123`

## Database Schema

The schema includes:
- `users` - User accounts
- `alumni_profiles` - Alumni profile information
- `events` - Events
- `event_registrations` - Event registrations (many-to-many)
- `job_posts` - Job postings
- `job_applications` - Job applications
- `announcements` - Announcements

## Troubleshooting

### Connection Refused
- Check MySQL is running: `sudo systemctl status mysql`
- Verify credentials in `.env`
- Check firewall settings

### Access Denied
- Reset MySQL root password if needed
- Create a new MySQL user:
  ```sql
  CREATE USER 'alumni_user'@'localhost' IDENTIFIED BY 'password';
  GRANT ALL PRIVILEGES ON alumni_management.* TO 'alumni_user'@'localhost';
  FLUSH PRIVILEGES;
  ```

### Tables Already Exist
- The setup script handles this gracefully
- To reset: `DROP DATABASE alumni_management;` then run setup again
