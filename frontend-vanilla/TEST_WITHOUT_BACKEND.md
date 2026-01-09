# Test Frontend Without Backend

## Quick Setup

To test the login UI without connecting to a backend:

1. **Edit `index.html`** - Uncomment the mock API line:

```html
<!-- Change this: -->
<!-- <script src="js/api-mock.js"></script> -->

<!-- To this: -->
<script src="js/api-mock.js"></script>

<!-- And comment out the real API: -->
<!-- <script src="js/api.js"></script> -->
```

2. **Refresh your browser**

## Test Credentials (Mock Mode)

- **Admin:** `admin@example.com` / `admin123`
- **Alumni:** `alumni@example.com` / `alumni123`
- **Student:** `student@example.com` / `student123`

## What Works in Mock Mode

✅ Login/Register UI
✅ Navigation
✅ Page routing
✅ Basic UI interactions

❌ Real data (uses mock data)
❌ Database operations
❌ File uploads

## Switch Back to Real API

When ready to connect to backend:

1. Comment out mock API: `<!-- <script src="js/api-mock.js"></script> -->`
2. Uncomment real API: `<script src="js/api.js"></script>`
3. Make sure backend is running on port 5000
4. Update API URL in `js/api.js` if needed

