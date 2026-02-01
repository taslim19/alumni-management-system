# Migration Guide: MongoDB to MySQL

## What Changed

✅ **Database:** MongoDB → MySQL  
✅ **ORM:** Mongoose → Sequelize  
✅ **Schema:** Created SQL schema file  
✅ **Models:** Converted to Sequelize models  
✅ **Setup Script:** Automated database creation

## Quick Setup

### 1. Install MySQL

```bash
# Ubuntu/Debian
sudo apt install mysql-server

# Start MySQL
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Configure Database

Create/update `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=alumni_management
DB_USER=root
DB_PASSWORD=your_mysql_password
```

### 4. Create Database

```bash
npm run setup-db
```

This will:
- Create the database
- Create all tables
- Insert default admin user

### 5. Start Server

```bash
npm run dev
```

## Key Changes in Code

### Models
- `User.findById()` → `User.findByPk()`
- `User.findOne({ email })` → `User.findOne({ where: { email } })`
- `user.save()` → `user.save()` (same)
- `new Model()` → `Model.create()`

### Queries
- Mongoose: `Model.find({ field: value })`
- Sequelize: `Model.findAll({ where: { field: value } })`

### Associations
- Sequelize uses `belongsTo`, `hasMany`, `belongsToMany`
- Include related data: `include: [{ model: User }]`

## Route Updates Needed

All route files need to be updated from Mongoose to Sequelize syntax. Example:

**Before (Mongoose):**
```javascript
const user = await User.findById(id);
const users = await User.find({ role: 'alumni' });
```

**After (Sequelize):**
```javascript
const user = await User.findByPk(id);
const users = await User.findAll({ where: { role: 'alumni' } });
```

## Next Steps

1. ✅ Database schema created
2. ✅ Models converted
3. ⏳ Update all route files (auth.js example provided)
4. ⏳ Test all endpoints
5. ⏳ Update admin routes
6. ⏳ Update alumni routes
7. ⏳ Update student routes

## Default Admin

- Email: `admin@example.com`
- Password: `admin123`
