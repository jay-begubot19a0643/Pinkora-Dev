# Supabase & Vercel Deployment Guide

## Step 1: Create Supabase Project

1. Go to **https://supabase.com**
2. Sign up (free account)
3. Create a new project:
   - Name: `pinkora-dev`
   - Choose a region closest to you
   - Create a strong password
4. Wait for the project to initialize (2-3 minutes)

## Step 2: Get Your Supabase Credentials

1. Go to your project dashboard
2. Click **Settings** → **API**
3. Copy and save these:
   - **Project URL** (starts with `https://...supabase.co`)
   - **Anon/Public Key** (long string starting with `eyJ...`)

## Step 3: Create Database Tables

1. In Supabase, click **SQL Editor** on the left sidebar
2. Click **+ New Query**
3. Open the file: `database-setup-supabase.sql` from this project
4. Copy all the SQL code
5. Paste it into the Supabase SQL editor
6. Click **RUN** (or Ctrl+Enter)
7. Wait for tables to be created (you should see "Success" message)

## Step 4: Setup Local Environment

1. Create a `.env` file in the project root:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   JWT_SECRET=your-secret-key-123
   NODE_ENV=development
   PORT=3000
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Test locally:
   ```bash
   npm start
   ```
   Should show: `✅ Supabase connected successfully`

## Step 5: Deploy to Vercel

### Option A: Using Vercel Dashboard (Easiest)

1. Go to **https://vercel.com**
2. Click **Import Project**
3. Select your GitHub repository `pinkora-dev`
4. Click **Import**
5. Go to **Settings** → **Environment Variables**
6. Add these variables:
   - `SUPABASE_URL` = `https://your-project.supabase.co`
   - `SUPABASE_ANON_KEY` = your anon key
   - `JWT_SECRET` = any secure string
   - `NODE_ENV` = `production`
7. Click **Deploy**

### Option B: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

4. Follow the prompts to add environment variables

## Step 6: Verify Deployment

1. After deployment, go to your Vercel dashboard
2. Click on the `pinkora-dev` project
3. You should see a **Production** deployment with a green checkmark
4. Click the URL to visit your live site
5. Test the API:
   ```
   https://your-project.vercel.app/api/health
   ```
   Should return: `{"status":"OK","timestamp":"2024-..."}`

## Step 7: Test Features

### Create a User Account
- Go to **https://your-project.vercel.app/account.html**
- Sign up with email and password
- Should work if Supabase is connected

### Submit Contact Form
- Go to **https://your-project.vercel.app/contact.html**
- Fill out and submit
- Should be saved in Supabase `contacts` table

### View Recommendations
- Go to **https://your-project.vercel.app/clients.html**
- Login and submit a recommendation
- Should appear in Supabase `recommendations` table

## Troubleshooting

### "Supabase connected successfully" but features don't work
- Check Vercel environment variables are set correctly
- Go to Vercel Dashboard → Settings → Environment Variables
- Redeploy after adding variables

### 500 errors on API calls
- Check Vercel Function Logs:
  - Go to Vercel Dashboard → project → Deployments → latest
  - Click **View Function Logs**
  - Look for error messages

### Database tables not created
- Make sure you ran all the SQL from `database-setup-supabase.sql`
- Go to Supabase → SQL Editor → verify tables exist
- Tables should be: `users`, `contacts`, `feedback`, `recommendations`

### CORS errors
- Already handled in `server.js`
- If still getting CORS errors, go to Supabase → Settings → Authentication → JWT Expiry
- Increase JWT expiry time to 3600 seconds

## Next Steps

After successful deployment:

1. **Monitor your site**: Check Vercel Analytics dashboard
2. **Backup data**: Supabase has automatic backups, but enable point-in-time recovery
3. **Scale up**: When traffic increases, Supabase free tier may need upgrade
4. **Add custom domain**: In Vercel Settings → Domains

## Support Links

- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Express.js: https://expressjs.com
- Supabase JS Client: https://supabase.com/docs/reference/javascript/introduction
