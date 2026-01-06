#!/bin/bash

# Alumni Management System - VPS Setup Script
# Run this script on your AWS EC2 instance

echo "🚀 Starting Alumni Management System Setup..."

# Step 1: Update Node.js to v18 (LTS)
echo "📦 Updating Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js version
node --version
npm --version

# Step 2: Install MongoDB (if not already installed)
echo "📦 Installing MongoDB..."
if ! command -v mongod &> /dev/null; then
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    sudo apt-get update
    sudo apt-get install -y mongodb-org
    sudo systemctl start mongod
    sudo systemctl enable mongod
    echo "✅ MongoDB installed and started"
else
    echo "✅ MongoDB already installed"
fi

# Step 3: Install PM2 globally (for process management)
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Step 4: Backend Setup
echo "📦 Setting up Backend..."
cd backend
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    cat > .env << EOF
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/alumni_management
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
UPLOAD_PATH=./uploads
EOF
    echo "✅ Created .env file"
else
    echo "✅ .env file already exists"
fi

# Create uploads directory
mkdir -p uploads
cd ..

# Step 5: Frontend Setup
echo "📦 Setting up Frontend..."
cd frontend
npm install
cd ..

# Step 6: Create Admin User Script
echo "📝 Creating admin user script..."
cat > backend/scripts/createAdmin.js << 'EOF'
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists!');
      process.exit(0);
    }

    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      isApproved: true
    });
    
    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️  Please change the password after first login!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
EOF

# Step 7: Create Admin User
echo "👤 Creating admin user..."
cd backend
node scripts/createAdmin.js
cd ..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Start backend: cd backend && npm start (or use PM2: pm2 start server.js --name alumni-backend)"
echo "2. Start frontend: cd frontend && npm run dev (or build for production: npm run build)"
echo "3. Configure AWS Security Groups to allow ports 3000 (frontend) and 5000 (backend)"
echo "4. Access the app at: http://your-ec2-ip:3000"
echo ""
echo "💡 For production, consider:"
echo "   - Using PM2: pm2 start backend/server.js --name alumni-backend"
echo "   - Using Nginx as reverse proxy"
echo "   - Setting up SSL with Let's Encrypt"

