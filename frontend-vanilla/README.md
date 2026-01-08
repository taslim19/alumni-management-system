# Alumni Management System - Vanilla JavaScript Frontend

This is a pure HTML, CSS, and JavaScript version of the frontend (no React required).

## Setup

1. **Copy files to your web server** or use a simple HTTP server:

```bash
# Using Python
python3 -m http.server 3000

# Using Node.js http-server
npx http-server -p 3000

# Using PHP
php -S localhost:3000
```

2. **Update API URL** in `js/api.js`:
```javascript
const API_BASE_URL = 'http://your-backend-url:5000/api';
```

3. **Open in browser**: `http://localhost:3000`

## File Structure

```
frontend-vanilla/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styles
├── js/
│   ├── api.js          # API helper functions
│   ├── auth.js          # Authentication functions
│   ├── utils.js         # Utility functions
│   ├── navbar.js        # Navbar component
│   ├── router.js        # Simple router
│   └── app.js           # App initialization
└── pages/
    ├── login.js         # Login page
    ├── register.js      # Register page
    ├── admin/           # Admin pages
    ├── alumni/          # Alumni pages
    └── student/         # Student pages
```

## Features

- Pure JavaScript (no build step required)
- Simple routing system
- API integration
- Responsive design
- All features from React version

## Notes

- Uses ES6 modules for code organization
- Works in modern browsers
- No dependencies required (except Font Awesome CDN for icons)

