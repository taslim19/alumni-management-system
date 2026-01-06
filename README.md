# Alumni Management System

A comprehensive web-based system for managing alumni data, communication, events, and networking between alumni, students, and administrators.

## 🎯 Features

### User Roles
- **Admin**: Full system access with management capabilities
- **Alumni**: Profile management, networking, job postings, event registration
- **Student**: View alumni profiles, browse jobs, register for events

### Core Features

#### Admin Panel
- Dashboard with statistics and analytics
- Approve/reject alumni registrations
- Manage alumni records (add, edit, delete)
- Create and manage events
- Send announcements to users
- Manage job postings
- Export alumni data (CSV/PDF)

#### Alumni Features
- Register and create profile
- Update personal & professional details
- Upload profile photo
- Search and connect with other alumni
- View and register for events
- Post job opportunities
- View announcements
- Privacy settings

#### Student Features
- View alumni profiles (with privacy restrictions)
- Browse job postings
- Register for events
- View announcements

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing
- **PDFKit** & **csv-writer** for data export

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Recharts** for analytics
- **React Icons** for icons

## 📦 Quick Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
# Copy .env.example and update with your values, or create manually:
```

Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/alumni_management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
UPLOAD_PATH=./uploads
```

```bash
# Create uploads directory
mkdir uploads

# Start backend server
npm run dev
```

✅ Backend running on `http://localhost:5000`

### Step 2: Frontend Setup

Open a **new terminal**:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start frontend server
npm run dev
```

✅ Frontend running on `http://localhost:3000`

### Step 3: Create Admin User

Create `backend/scripts/createAdmin.js`:

```javascript
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      isApproved: true
    });
    
    await admin.save();
    console.log('✅ Admin user created!');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
```

Run the script:
```bash
node backend/scripts/createAdmin.js
```

### Step 4: Access Application

1. Open browser: `http://localhost:3000`
2. Login with admin credentials:
   - Email: `admin@example.com`
   - Password: `admin123`
3. Start managing alumni!

## 📁 Project Structure

```
alumni-management/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Utility functions
│   ├── uploads/         # Uploaded files
│   ├── server.js        # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Context providers
│   │   └── App.jsx      # Main app component
│   ├── index.html
│   └── package.json
└── README.md
```

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication. Tokens are stored in localStorage and sent with each API request in the Authorization header.

### Protected Routes
- All routes except `/login` and `/register` require authentication
- Role-based access control ensures users only access appropriate routes
- Alumni must be approved by admin before accessing features

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Admin Routes
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/alumni` - Get all alumni
- `PUT /api/admin/alumni/:id/approve` - Approve/reject alumni
- `DELETE /api/admin/alumni/:id` - Delete alumni
- `POST /api/admin/events` - Create event
- `PUT /api/admin/events/:id` - Update event
- `DELETE /api/admin/events/:id` - Delete event
- `POST /api/admin/announcements` - Create announcement
- `GET /api/admin/jobs` - Get all jobs
- `DELETE /api/admin/jobs/:id` - Delete job
- `GET /api/admin/export/csv` - Export CSV
- `GET /api/admin/export/pdf` - Export PDF

### Alumni Routes
- `GET /api/alumni/profile` - Get profile
- `PUT /api/alumni/profile` - Update profile
- `POST /api/alumni/profile/photo` - Upload photo
- `GET /api/alumni/search` - Search alumni
- `GET /api/alumni/events` - Get events
- `POST /api/alumni/events/:id/register` - Register for event
- `POST /api/alumni/events/:id/unregister` - Unregister from event
- `GET /api/alumni/jobs` - Get jobs
- `POST /api/alumni/jobs` - Post job
- `GET /api/alumni/announcements` - Get announcements

### Student Routes
- `GET /api/student/alumni` - View alumni
- `GET /api/student/alumni/:id` - View single alumni
- `GET /api/student/events` - Get events
- `POST /api/student/events/:id/register` - Register for event
- `GET /api/student/jobs` - Get jobs
- `GET /api/student/announcements` - Get announcements

## 🎨 Features in Detail

### Search & Filter
- Search alumni by name, company, position
- Filter by department, graduation year, company
- Pagination support

### Privacy Settings
- Alumni can control visibility of:
  - Email address
  - Phone number
  - Location

### Event Management
- Create events with details
- Set maximum attendees
- Track registrations
- Event types: networking, workshop, seminar, reunion

### Job Postings
- Alumni can post job opportunities
- Include salary range, location, employment type
- Contact information for applications

### Data Export
- Export alumni data as CSV
- Export alumni data as PDF
- Includes all profile information

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control
- Input validation
- File upload restrictions
- CORS configuration

## 🐛 Troubleshooting

### MongoDB Connection Failed
**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
- Ensure MongoDB is running: `mongod` or start MongoDB service
- Check connection string in `.env`
- For Windows: MongoDB might be running as a service

### Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill
```

### CORS Errors
**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
- Check `FRONTEND_URL` in backend `.env` matches your frontend URL
- Ensure backend CORS is configured correctly

### JWT Token Errors
**Error:** `Invalid or expired token`

**Solution:**
- Clear browser localStorage
- Login again
- Check `JWT_SECRET` in `.env` is set

### Module Not Found
**Error:** `Cannot find module 'xyz'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Use MongoDB Atlas or secure MongoDB instance
4. Set up proper CORS for production domain
5. Use process manager like PM2:
```bash
npm install -g pm2
pm2 start server.js --name alumni-backend
```

### Frontend
1. Build for production:
```bash
cd frontend
npm run build
```
2. Serve `dist` folder with nginx or similar
3. Configure API proxy if needed

## 📝 License

This project is open source and available for educational purposes.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for educational institutions
