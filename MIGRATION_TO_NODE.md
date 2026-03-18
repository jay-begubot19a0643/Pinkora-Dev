# Pinkora Dev - Node.js Backend Migration

This document explains the migration from PHP to Node.js/Express backend and deployment to Vercel.

## What Changed

### Backend Migration: PHP → Node.js/Express
All PHP files have been converted to Express.js routes:

| Endpoint | Old | New |
|----------|-----|-----|
| Register | `POST /api/register.php` | `POST /api/auth/register` |
| Login | `POST /api/login.php` | `POST /api/auth/login` |
| Auth Check | `GET /api/auth-check.php` | `GET /api/auth/check` |
| Logout | `POST /api/logout.php` | `POST /api/auth/logout` |
| Feedback | `POST /api/submit-feedback.php` | `POST /api/submit-feedback` |
| Contact | `POST /api/contact-form.php` | `POST /api/contact-form` |

### Database Migration: MySQL → MongoDB
- MongoDB Atlas (cloud) replaces local MySQL
- No schema changes needed (same data structure)
- Easier to deploy and scale

### Authentication: Sessions → JWT Tokens
- Old: PHP sessions with cookies
- New: JWT tokens stored in localStorage
- Better for serverless environment (Vercel)

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Create `.env` file (copy from `.env.example`):
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pinkora_db
JWT_SECRET=your-super-secret-key
NODE_ENV=development
PORT=3000
```

### 3. Get MongoDB Atlas URL
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Replace in `.env`

### 4. Run Locally
```bash
npm run dev
```

Visit http://localhost:3000

## Frontend Changes

### Updated API Calls
All `auth.js` API calls now:
- Use JWT tokens in `Authorization` header
- Store tokens in `localStorage`
- No longer use credentials/cookies

Example:
```javascript
fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
  },
  body: JSON.stringify({ email, password })
})
```

## Deployment to Vercel

### Prerequisites
- GitHub repository (✅ already done)
- Vercel account (free at vercel.com)
- MongoDB Atlas connection string

### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Feat: Migrate PHP backend to Node.js with MongoDB"
   git push origin master
   ```

2. **Create Vercel Project**
   - Go to https://vercel.com/import
   - Select your GitHub repository
   - Click "Import"

3. **Set Environment Variables**
   - In Vercel dashboard → Project Settings → Environment Variables
   - Add:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Generate random secret key
     - `NODE_ENV`:  production

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Get your live URL (something like `pinkora-dev.vercel.app`)

### Post-Deployment

1. **Test Endpoints**
   - Register: `POST https://your-domain.vercel.app/api/auth/register`
   - Login: `POST https://your-domain.vercel.app/api/auth/login`
   - Check: `GET https://your-domain.vercel.app/api/auth/check`

2. **Update Frontend**
   - If API_URL is hardcoded, update it
   - Current: `const API_URL = '/api'` (automatically uses Vercel domain)

3. **Monitor Logs**
   - Vercel Dashboard → Deployments → View logs
   - Check for any errors

## Project Structure

```
Pinkora Dev/
├── server.js                 (Main Express app)
├── package.json              (Dependencies)
├── vercel.json              (Vercel config)
├── .env.example             (Environment template)
├── .gitignore               (Git ignore rules)
│
├── api/
│   ├── models/              (MongoDB schemas)
│   │   ├── User.js          (User schema)
│   │   ├── Feedback.js      (Feedback schema)
│   │   └── Contact.js       (Contact schema)
│   ├── routes/              (Express routes)
│   │   ├── auth.js          (Auth endpoints)
│   │   ├── feedback.js      (Feedback endpoints)
│   │   └── contact.js       (Contact endpoints)
│   └── middleware/          (Custom middleware)
│       └── auth.js          (JWT verification)
│
├── auth.js                  (Frontend auth logic)
├── script.js                (Frontend app logic)
├── styles.css               (Styling)
├── *.html                   (HTML pages)
└── images/                  (Asset images)
```

## Troubleshooting

### MongoDB Connection Failed
- Check connection string in `.env`
- Verify IP whitelist in MongoDB Atlas (allow all IPs: 0.0.0.0/0)
- Test connection string with MongoDB Compass

### JWT Token Issues
- Token expired? User needs to login again
- Invalid token? Check `JWT_SECRET` matches between dev & production
- Missing auth header? Check frontend is sending `Authorization` header

### Vercel Deployment Failed
- Check build logs: Vercel Dashboard → Deployments → Failed build
- Ensure all dependencies in `package.json`
- Verify environment variables are set
- Check Node version is 18.x or higher

## Next Steps

1. ✅ Create MongoDB Atlas account and cluster
2. ✅ Get MongoDB connection string
3. ✅ Test locally with `npm run dev`
4. ✅ Push code to GitHub
5. ✅ Deploy to Vercel (connect GitHub repo)
6. ✅ Set environment variables on Vercel
7. ✅ Test live endpoints
8. Optional: Setup email notifications for contact/feedback
9. Optional: Add analytics or monitoring

## Support

For issues or questions:
- Check MongoDB Atlas docs: https://docs.mongodb.com/
- Check Express.js docs: https://expressjs.com/
- Check Vercel docs: https://vercel.com/docs
- Check your deployment logs on Vercel dashboard
