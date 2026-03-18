# Pinkora Hostinger Setup - Checklist & Reference

## 📋 Pre-Setup Checklist (Do This First)

Before you start, gather this info:

- [ ] Your Hostinger email
- [ ] Your Hostinger password  
- [ ] Your domain name (example.com)
- [ ] Jaybe's email: jaybe.gubot01@gmail.com (for contact form to send to)

---

## 🟦 Step 1: Create Hostinger Account

**Where**: https://www.hostinger.com/

**What to do**:
1. [ ] Click "Get Started"
2. [ ] Choose **Basic Plan** ($2.99/month)
3. [ ] Enter your email
4. [ ] Create password
5. [ ] Enter your domain name (or register a new one)
6. [ ] Complete payment
7. [ ] Check email for confirmation

**Save these details**:
- Email: ________________
- Username/Login: ________________
- Hostinger hPanel URL: https://hpanel.hostinger.com/

---

## 🟦 Step 2: Create MySQL Database

**Where**: hPanel → Databases → MySQL Databases

**What to do**:
1. [ ] Log in to hPanel
2. [ ] Click "Databases"
3. [ ] Click "MySQL Databases"
4. [ ] Click "Create Database"
5. [ ] Database name: `pinkora_db`
6. [ ] Click Create
7. [ ] System shows you 3 pieces of info:

**Save these (VERY IMPORTANT)**:
- Database Name: `pinkora_db`
- Username: ________________
- Password: ________________
- Host: `localhost`

⚠️ **SCREENSHOT THIS!** You'll need it for Step 4.

---

## 🟦 Step 3: Create Database Tables

**Where**: hPanel → Databases → phpMyAdmin

**What to do**:
1. [ ] Go back to hPanel
2. [ ] Find "Databases" section
3. [ ] Click "phpMyAdmin"
4. [ ] Log in with the credentials from Step 2
5. [ ] Select database: `pinkora_db`
6. [ ] Click "SQL" tab
7. [ ] See the text box for entering SQL code
8. [ ] Open file: `database-setup.sql` (in your /Pinkora Dev/ folder)
9. [ ] Copy ALL the code from that file
10. [ ] Paste into phpMyAdmin SQL box
11. [ ] Click "Go" or "Execute"
12. [ ] You should see "Database tables created successfully!"

✅ **Done**: Your database now has 5 tables (users, feedback, purchases, subscriptions, comments)

---

## 🟦 Step 4: Set Up API Config File

**Where**: Your computer, file: `/api/config.php`

**What to do**:
1. [ ] Open file: `/api/config.php` in a text editor (VS Code, Notepad++, etc.)
2. [ ] Find these lines:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'your_db_username'); ← CHANGE THIS
define('DB_PASS', 'your_db_password'); ← CHANGE THIS
define('DB_NAME', 'pinkora_db');
```

3. [ ] Replace `'your_db_username'` with YOUR username from Step 2
4. [ ] Replace `'your_db_password'` with YOUR password from Step 2
5. [ ] Save the file (Ctrl+S)

**Example** (don't use this, use YOUR values):
```php
define('DB_USER', 'user_a2b3c4');
define('DB_PASS', 'MySecurePass123!');
```

✅ **Done**: config.php now has your database credentials

---

## 🟦 Step 5: Upload API Folder

**Where**: hPanel → Files → File Manager

**What to do**:
1. [ ] Log in to hPanel
2. [ ] Click "Files" → "File Manager"
3. [ ] Click on `public_html` folder
4. [ ] Inside, check if there's already an `/api/` folder
   - If YES, skip to step 6
   - If NO, create it:
     - Right-click → "New Folder"
     - Name: `api`
     - Click Create

5. [ ] Double-click to open the `/api/` folder
6. [ ] Upload these 7 files (one at a time or all together):
   - [ ] api/config.php ← ALREADY EDITED IN STEP 4
   - [ ] api/register.php
   - [ ] api/login.php
   - [ ] api/auth-check.php
   - [ ] api/logout.php
   - [ ] api/submit-feedback.php
   - [ ] api/contact-form.php

**How to upload**:
- Right-click in the folder → "Upload file"
- Or click blue "Upload" button
- Browse and select each file
- Wait for upload to complete (green checkmark)

✅ **Done**: All PHP API files are on your server

---

## 🟦 Step 6: Upload Website Files

**Where**: hPanel → Files → File Manager → public_html

**What to do**:
1. [ ] Go back to File Manager
2. [ ] Make sure you're in `public_html` folder
3. [ ] Upload these files (replace existing versions):
   - [ ] account.html ← NEW VERSION
   - [ ] auth-hostinger.js ← NEW FILE
   - [ ] script.js ← UPDATED
   - [ ] styles.css (keep existing)
   - [ ] mainpage.html (keep existing)
   - [ ] services.html (keep existing)
   - [ ] projects.html (keep existing)
   - [ ] clients.html (keep existing)
   - [ ] contact.html (keep existing)
   - [ ] images/ folder (keep existing)

**Delete these**:
- [ ] Delete: `auth.js` (old Firebase version)
- [ ] Delete: `FIREBASE_SETUP.md` (no longer needed)

✅ **Done**: Your website files are updated

---

## 🟦 Step 7: Test Your Setup

**Where**: Your web browser

**What to do**:
1. [ ] Open: `https://yourdomain.com/account.html`
   (Replace `yourdomain.com` with YOUR domain)

2. [ ] If page loads, click "Sign Up"

3. [ ] Fill in test account:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `TestPassword123`
   - ☐ Check "I agree to Terms"

4. [ ] Click "Create Account"

5. [ ] You should see your dashboard with:
   - Your name displayed
   - 6 dashboard cards

✅ **Success**: Account system is working!

---

## 🟦 Step 8: Verify Data in Database

**Where**: hPanel → phpMyAdmin

**What to do**:
1. [ ] Go back to hPanel
2. [ ] Open phpMyAdmin
3. [ ] Select database: `pinkora_db`
4. [ ] Click table: `users`
5. [ ] You should see your test account:
   - name: Test User
   - email: test@example.com
   - created_at: (timestamp)

**If you see it**: ✅ Database is working!

**If empty**: 
- [ ] Go back to Step 4
- [ ] Check that config.php credentials are correct
- [ ] Ask in Hostinger support chat

---

## 🟦 Step 9: Enable HTTPS/SSL

**Where**: hPanel → SSL

**What to do**:
1. [ ] In hPanel, click "SSL"
2. [ ] Click "Let's Encrypt"
3. [ ] Click "Generate Free SSL Certificate"
4. [ ] Wait 1-2 hours
5. [ ] Check your domain - you should see green lock 🔒

✅ **Done**: Your site is now secure

---

## 📝 Test Account Info

**Use these to test your system**:

| Field | Value |
|-------|-------|
| Email | test@example.com |
| Password | TestPassword123 |
| Name | Test User |

**Can log in at**: yourdomain.com/account.html

---

## 📝 Contact Form Testing

**To test the contact form**:
1. [ ] Go to: yourdomain.com/contact.html
2. [ ] Fill in the form:
   - Name: Your Name
   - Email: Your Email
   - Subject: Test
   - Message: This is a test
3. [ ] Click "Send"
4. [ ] Check: jaybe.gubot01@gmail.com for the email

✅ **Success**: Contact form works!

---

## 🔍 Troubleshooting Checklist

### "Database connection failed" error

- [ ] Go to Step 4, recheck config.php
- [ ] Verify username is 100% correct
- [ ] Verify password is 100% correct
- [ ] Make sure database exists in Databases section
- [ ] Try uploading config.php again

### Can't create account / Blank page

- [ ] Check if `/api/register.php` was uploaded
- [ ] Check if `/api/config.php` has correct credentials
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Try from a different browser

### "Files permission denied" error

- [ ] Contact Hostinger support
- [ ] They can fix file permissions in seconds

### Not seeing green lock 🔒

- [ ] Wait 1-2 hours for SSL to generate
- [ ] Refresh the page
- [ ] Try https:// instead of http://

### Email not sending from contact form

- [ ] Check spam folder first
- [ ] Verify email address: jaybe.gubot01@gmail.com
- [ ] Contact Hostinger - they'll help with mail server

---

## 📞 Get Help

**Your resources**:
1. **Hostinger Support**: https://support.hostinger.com/
   - They respond within hours
   - Use chat, ticket, or phone

2. **This Documentation**:
   - HOSTINGER_QUICK_START.md (fast answers)
   - HOSTINGER_SETUP.md (detailed guide)
   - HOSTINGER_MIGRATION.md (overview)

3. **Common Issues**: See Troubleshooting section of HOSTINGER_SETUP.md

---

## ✅ Final Verification

When you're done, check all of these:

- [ ] Can create account at yourdomain.com/account.html
- [ ] Account shows in database (phpMyAdmin)
- [ ] Can log back in with that account
- [ ] Dashboard displays your profile
- [ ] Contact form sends to email
- [ ] Site has green lock 🔒 (HTTPS)
- [ ] All pages load (home, services, projects, contact)

**If ALL checked**: Congratulations! 🎉 You've successfully migrated to Hostinger!

---

## 💰 Cost Summary

| Item | Cost |
|------|------|
| Hostinger Hosting (yearly) | $35.88 |
| Domain (yearly) | $9.99 |
| Database | Included |
| Email | Included |
| **TOTAL YEARLY** | **$45.87** |

**Compare to Firebase**: $600-1,200/year

**You're saving**: $554-1,154 per year! 🎊

---

## 🎯 Next Steps

1. Start with Step 1 above
2. Come back and check off each box
3. Follow the exact instructions
4. Your site will be live in 1 day!

**Good luck! You've got this!** 💪
