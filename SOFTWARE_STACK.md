# JVerse — Software Stack

## Overview

JVerse is a full-stack portfolio and business-solutions website. It presents services, projects, clients, developer information, contact options, and account features through a responsive React interface. The application supports both dark and light themes.

The active application is built with Next.js. Its frontend pages and backend API routes live in the same project and are deployed together.

## Core Stack

| Area | Technology | Purpose |
| --- | --- | --- |
| Framework | Next.js 16 | Full-stack application framework, routing, server rendering, and API routes. |
| UI library | React 19 | Component-based user interface. |
| Language | TypeScript 6 | Type-safe application, component, and API code. |
| Styling | CSS | Responsive layout, animation, and dark/light theme styles. |
| Database | Supabase | Stores users, contacts, feedback, and recommendations. |
| Authentication | JSON Web Tokens (JWT) | Authenticates account API requests. |
| Password security | bcryptjs | Hashes passwords before they are stored. |
| Deployment | Vercel | Next.js deployment target. |

## Frontend

The frontend uses the Next.js App Router.

| Route | Source | Purpose |
| --- | --- | --- |
| `/` | `app/page.tsx` | Interactive landing page with video and scroll transitions. |
| `/services` | `app/services/page.tsx` | Software development services. |
| `/projects` | `app/projects/page.tsx` | Featured project and system capabilities. |
| `/clients` | `app/clients/page.tsx` | Client and partnership information. |
| `/about` | `app/about/page.tsx` | Developer background, mission, and principles. |
| `/contact` | `app/contact/page.tsx` | Contact form and communication details. |
| `/account` | `app/account/page.tsx` | Registration and sign-in interface. |

### Shared UI

- `app/layout.tsx` defines site metadata, global styling, smooth-scroll support, and the app shell.
- `components/site-shell.tsx` provides the responsive navigation bar, theme toggle, and footer.
- `components/page-hero.tsx` provides consistent page introductions.
- `components/landing-experience.tsx` handles landing-page scroll reveals and parallax behavior.
- `app/globals.css` contains the active Next.js design system and responsive styles.

### Assets

Runtime assets are served from the `public/` directory:

- `public/Intro-1.mp4` — landing-page video
- `public/web-development.mp4` — service video
- `public/images/` — Brand assets, assistant image, and developer photos

## Backend API

Next.js Route Handlers replace the primary Express API. They run on the server and use the Supabase client in `lib/supabase.ts`.

| Endpoint | Methods | Purpose |
| --- | --- | --- |
| `/api/health` | `GET` | Application health status. |
| `/api/contact-form` | `POST` | Stores a contact form submission. |
| `/api/auth/register` | `POST` | Registers a user and returns a JWT. |
| `/api/auth/login` | `POST` | Authenticates a user and returns a JWT. |
| `/api/auth/check` | `GET` | Returns the authenticated user profile. |
| `/api/auth/status` | `GET` | Returns the current token authentication state. |
| `/api/auth/logout` | `POST` | Validates an authenticated logout request. |
| `/api/feedback` | `GET`, `POST` | Reads and creates user feedback. |
| `/api/recommendations` | `GET` | Lists approved recommendations. |
| `/api/submit-recommendation` | `POST` | Creates an authenticated recommendation. |
| `/api/my-recommendations` | `GET` | Lists recommendations for the authenticated user. |

### Authentication Flow

1. A user registers or signs in through the account page.
2. The API validates the request and uses `bcryptjs` to hash or compare the password.
3. A JWT containing the user ID is returned to the client.
4. Authenticated requests send the token as `Authorization: Bearer <token>`.
5. `lib/auth.ts` verifies the JWT before accessing protected Supabase data.

## Database

Supabase provides the project data store. The application expects these primary tables:

- `users`
- `contacts`
- `feedback`
- `recommendations`

The supplied SQL setup files describe the required schema and are kept in the project root.

## Environment Variables

Create a `.env.local` file for local development. Use `.env.example` as the starting point.

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL. |
| `SUPABASE_ANON_KEY` | Supabase anonymous API key. |
| `JWT_SECRET` | Private key used to sign and verify JWTs. |
| `NODE_ENV` | Application environment, normally `development` or `production`. |
| `PORT` | Optional local port for legacy Express development. Next.js defaults to port 3000. |

Never commit production credentials to the repository. Configure them in Vercel for deployed environments.

## Local Development

Install dependencies and start the Next.js application:

```powershell
npm.cmd install
npm.cmd run dev
```

Create a production build:

```powershell
npm.cmd run build
npm.cmd run start
```

## Legacy Compatibility

The original static HTML pages, Express server (`server.js`), and older CSS/JavaScript files remain in the repository during the migration. They are available only for reference or rollback.

To run the legacy Express server:

```powershell
npm.cmd run legacy:dev
```

The primary development command is now `npm.cmd run dev`, which starts the Next.js application.
