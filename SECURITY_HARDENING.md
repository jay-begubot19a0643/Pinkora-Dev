# JVerse Security Hardening

## Required external actions

These actions require access to the Supabase and Vercel dashboards and cannot be performed from the source code alone.

1. In Supabase, run `database-security-hardening.sql` in the SQL Editor.
2. In Supabase **Settings -> API Keys**, rotate the server-side Secret key. Treat any previously shared secret as compromised.
3. In Vercel **Settings -> Environment Variables**, replace `SUPABASE_SECRET_KEY` with the new Secret key for Production, Preview, and Development as applicable.
4. Replace `SUPABASE_SECRET_KEY` in the local `.env.local` file with the new value. Do not commit `.env.local`.
5. Keep only the publishable key in `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Never put a `sb_secret_` or legacy `service_role` key in a `NEXT_PUBLIC_*` variable.
6. Add `APP_URL=https://www.jverse.site` in Vercel and `.env.local`. Email verification and password-reset links use this URL.
7. Configure SMTP before enabling new email-password registrations. New registrations require a verification email.
8. Redeploy Vercel, then test sign-up, verification, login, password reset, feedback, contact, and innovation actions.

## Rate-limit note

The application includes an in-memory rate limiter for immediate protection. Serverless instances do not share memory, so it is not a complete distributed DDoS control. Enable Vercel Firewall/WAF rate rules or use a shared store such as Upstash Redis before operating at larger scale.
