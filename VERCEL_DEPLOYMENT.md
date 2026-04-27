# Vercel Deployment Guide

Your Pinkora Dev is now configured for deployment on Vercel with React + Express.

## Setup Steps

### 1. Environment Variables
In your Vercel project settings, add these environment variables:

```
JWT_SECRET=your_jwt_secret_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=production
```

### 2. Build Configuration
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

These are already set in [vercel.json](vercel.json).

### 3. Deployment Flow

When you push to GitHub:
1. Vercel builds the React app: `npm run build` → creates `dist/`
2. Vercel packages the server files with `dist/`
3. Express serves:
   - `/api/*` routes → server.js (Node.js function)
   - Static files → `dist/` (React build)
   - All other routes → `dist/index.html` (React SPA routing)

### 4. Local Testing

Before pushing to Vercel, test the production build locally:

```bash
# Build React app
npm run build

# Start server (it will serve the dist folder)
NODE_ENV=production npm run start
```

Then open http://localhost:3000 and verify it works.

## Troubleshooting

**"Cannot GET /"**
- Make sure `npm run build` completed successfully
- Check that `dist/index.html` exists locally
- Verify vercel.json has `buildCommand` set

**API calls not working**
- Check environment variables in Vercel Settings
- Verify SUPABASE_URL and SUPABASE_ANON_KEY are correct
- Check Express routes in server.js are working

**Styles not loading**
- Clear browser cache (Ctrl+Shift+Delete)
- Rebuild: `npm run build`
- Check Network tab in DevTools for 404s

## File Changes

- [vercel.json](vercel.json) - Updated with React build config
- [server.js](server.js) - Added dist/ serving for production
- [package.json](package.json) - Already has correct build scripts
