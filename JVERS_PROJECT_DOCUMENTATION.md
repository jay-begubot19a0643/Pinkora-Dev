# JVerse Project Documentation

**Project:** JVerse personal portfolio and interactive community platform  
**Owner:** Jay-Be Gubot  
**Document status:** Current implementation reference  
**Last updated:** August 3, 2026

## 1. Project overview

JVerse is a full-stack portfolio website and personal developer platform. It presents Jay-Be's work, services, tools, collaborations, and development journey while giving visitors useful ways to interact with the site.

The application is designed around four goals:

1. Present a professional developer portfolio.
2. Explain real software projects and the problems they solve.
3. Give visitors interactive community features through Voices of Innovation.
4. Provide secure account, feedback, contact, and demo-request workflows.

The project has evolved from a static portfolio into a responsive web application with authentication, database-backed features, scoring, leaderboards, and a guided assistant.

## 2. Current website sections

| Route | Page | Purpose |
| --- | --- | --- |
| `/overview` | Overview Page | Landing experience, introduction, community highlights, leaderboards, and feedback. |
| `/solutions` | Solutions | Services and practical software capabilities. |
| `/portfolio` | Portfolio | Featured projects, project details, and free demo booking. |
| `/portfolio/voices-of-innovation` | Voices of Innovation | Real-world challenges, answers, scoring, badges, and leaderboards. |
| `/collaborations` | Collaborations | Trusted client work and community feedback. |
| `/who-am-i` | Who Am I | Developer profile, journey, principles, and stack specialist section. |
| `/tools-and-platforms` | Tools & Platforms | Technology stack and application architecture. |
| `/get-in-touch` | Get in Touch | Contact form and direct communication details. |
| `/my-account` | My Account | Registration, sign-in, profile settings, and personal dashboard. |

Legacy URLs such as `/projects`, `/services`, `/clients`, `/about`, `/stack`, `/contact`, and `/account` redirect to the current branded routes.

## 3. Technology stack

### Application foundation

| Layer | Technology | How it is used |
| --- | --- | --- |
| Runtime | Node.js 24 | Runs the development server and production application. |
| Framework | Next.js 16 | App Router, pages, metadata, server rendering, and backend route handlers. |
| UI library | React 19 | Reusable interactive components and client-side state. |
| Language | TypeScript 6 | Type-safe pages, components, data models, and server code. |
| Package manager | npm | Dependency installation and project scripts. |

### Interface and design

| Technology | Purpose |
| --- | --- |
| CSS | Responsive layouts, cards, forms, animations, transitions, and theme styles. |
| Space Grotesk | Brand and heading typography. |
| Inter | Body copy, navigation, forms, and readable interface text. |
| JetBrains Mono | Code and technical text. |
| CSS variables | Centralized colors, spacing, borders, shadows, and dark/light theme values. |
| IntersectionObserver | Scroll reveal animations that work when content enters and leaves the viewport. |

The visual theme uses the JVerse palette: black, white, dark blue, orange, and red. Dark mode is the initial theme and light mode remains available through the theme control. Header and assistant logos change according to the active theme.

### Data, authentication, and email

| Technology | Purpose |
| --- | --- |
| Supabase | Hosted PostgreSQL data storage and optional Supabase OAuth support. |
| PostgreSQL | Stores users, contacts, feedback, recommendations, innovation answers, and votes. |
| `@supabase/supabase-js` | Server and browser communication with Supabase. |
| JWT | Authenticates protected application requests. |
| `jsonwebtoken` | Creates and verifies application JWTs. |
| `bcryptjs` | Hashes and verifies email-password credentials. |
| Nodemailer | Sends contact and demo-request email through SMTP. |
| Google OAuth through Supabase | Provides Google sign-in when the public Supabase variables and provider settings are configured. |

### Deployment and delivery

| Technology | Purpose |
| --- | --- |
| GitHub | Source-code repository and version history. |
| Vercel | Production deployment for the Next.js application and route handlers. |
| Docker | Documented option for consistent local or server environments. |
| Kubernetes | Documented orchestration option for future multi-service scaling. |

Docker and Kubernetes are part of the development journey and deployment readiness. The current production deployment is optimized for Next.js on Vercel.

## 4. Application architecture

JVerse uses a unified Next.js architecture:

```text
Visitor browser
    |
    v
React components and Next.js pages
    |
    v
Next.js Route Handlers (/api/*)
    |
    +--> JWT validation and input validation
    +--> Supabase PostgreSQL
    +--> SMTP email delivery
```

Important implementation areas:

- `app/` contains routes, page metadata, global styles, and API handlers.
- `components/` contains reusable UI such as navigation, forms, assistant, feedback, dashboard, video, and innovation interfaces.
- `lib/` contains authentication helpers, Supabase clients, journey content, scoring rules, and challenge generation.
- `public/` contains public images, logos, and video assets.
- Root SQL files document the database schema and incremental migrations.

The main backend routes are:

| Endpoint | Purpose |
| --- | --- |
| `/api/auth/register` | Creates an email-password account after privacy consent. |
| `/api/auth/login` | Authenticates an existing account. |
| `/api/auth/check` | Checks the current user and loads dashboard data. |
| `/api/auth/status` | Reports authentication state. |
| `/api/auth/logout` | Handles authenticated logout requests. |
| `/api/feedback` | Reads public feedback and creates signed-in feedback. |
| `/api/innovation` | Loads leaderboards, submits answers, records votes, scores answers, and handles quick challenges. |
| `/api/contact-form` | Validates, stores, and emails contact or demo messages. |
| `/api/recommendations` | Reads public recommendations. |
| `/api/submit-recommendation` | Creates an authenticated recommendation. |
| `/api/my-recommendations` | Reads the current user's recommendations. |
| `/api/health` | Provides an application health response. |

## 5. Features accomplished

### Professional portfolio experience

- Rebranded the website from the earlier Pinkora naming to JVerse.
- Added branded navigation names: Overview Page, Solutions, Portfolio, Collaborations, Who Am I, Tools & Platforms, and Get in Touch.
- Added page-specific metadata so browser tabs and search engine titles match the current page names.
- Added responsive navigation for desktop, tablet, and mobile screens.
- Added a hover-based Portfolio menu for project sections and Voices of Innovation.
- Added responsive cards, forms, page heroes, CTAs, and footer navigation.
- Added scroll-up and scroll-down reveal transitions across pages.
- Preserved the existing visual identity while making spacing, hierarchy, and interactions more modern.

### Theme and branding

- Dark mode is the initial page theme.
- Light mode remains available through the theme toggle.
- Dark and light JVerse brand logos are selected automatically in the header.
- The Kuya Jay Assistant uses the same theme-aware brand logo behavior.
- Background lighting and accents use the JVerse black, white, blue, orange, and red palette.
- Space Grotesk, Inter, and JetBrains Mono are applied consistently to brand, interface, and technical content.

### Landing and media experience

- Added a responsive landing video section.
- Added a sound control so visitors can enable or mute video audio.
- The implementation attempts to play with sound, then falls back to muted autoplay when the browser blocks audible autoplay.
- Added the developer portrait as a transparent cutout alongside the main experience.
- Removed unwanted captions and visual frames from the media presentation.

Browsers commonly block audible autoplay until the visitor interacts with the page. The sound control is therefore an important fallback for a reliable user experience.

### Kuya Jay Assistant

- Added a persistent assistant across the website.
- Named the assistant **Kuya Jay Assistant**.
- Added an animated attention prompt: “Hi, I'm here!”
- Added a continuously moving assistant launcher to make help discoverable.
- Added common question suggestions and a free-text question form.
- Added contextual answers about the website, services, projects, account, technology stack, journey, and advice.
- Added clickable links inside answers so visitors can proceed directly to relevant pages.
- Added theme-aware JVerse branding to the assistant avatar.

The assistant is currently a transparent, rules-based website guide. It does not require a paid AI API and does not claim to be a general-purpose language model.

### Accounts and personalization

- Added email and password registration and login.
- Added JWT-protected application requests.
- Added bcrypt password hashing.
- Added Google sign-in integration through Supabase OAuth when configured.
- Added a required Data Privacy Act of 2012 consent step before email registration, email login, or Google sign-in.
- Added profile settings for changing the display name.
- Updated existing feedback and innovation contributions when a display name changes.
- Changed the navigation account action from Sign up to My Account after authentication.

### Personal user dashboard

After signing in, a user can see:

- Total innovation answers.
- Total points.
- Overall rank and participant count.
- Feedback count.
- Demo-request count.
- Earned badges.
- Recent Voices of Innovation answers.
- Personal feedback history and ratings.
- Demo-request history and status.

This gives users a reason to return and makes their participation visible.

### Voices of Innovation

Voices of Innovation is a public community learning and ranking feature.

Current categories:

- Business
- Education
- Tech
- Lifestyle
- Healthcare
- Agriculture
- Public Service
- Creative & Media

Every category includes four challenge levels:

- Easy
- Medium
- Hard
- Advanced

Completed functionality includes:

- Real-world open-ended questions for each category and level.
- Public leaderboard viewing.
- Authenticated answer submission.
- Authenticated voting with duplicate-vote protection.
- Top-three badges: Visionary Thinker, Community Builder, and Innovator Rising.
- Contributor lists that include users outside the top three.
- Automatic rank and points display for the current user.
- Unlimited generated quick challenges that ask users to choose the strongest practical answer.
- Level-based quick challenge rewards.
- Server-side validation of fields, levels, rounds, and selected answers.
- A transparent free scoring rubric for open answers:
  - Relevance to the selected question.
  - Practical steps included.
  - Clear reasoning.
  - Sufficient detail.
  - Constructive tone.
- Submission-success popup with awarded points.
- Feedback form after an answer or quick challenge is submitted.
- Overview-page leaderboard preview and community contribution list.

The scoring system is intentionally rules-based. It provides understandable 1-10 scoring without paid OpenAI usage or hidden model decisions.

The new category database constraint is documented in:

- `database-expand-innovation-categories.sql`

That migration must be run once in the Supabase SQL Editor before the new categories can be stored.

### Feedback and collaboration

- Signed-in users can submit feedback with a category and 1-5 star rating.
- Public visitors can read reviewed feedback without signing in.
- Feedback is shown on Overview and Collaborations.
- All returned feedback entries are displayed in a contained scrollable section.
- The section displays the total number of community feedback entries.
- Feedback is also included in each user's personal dashboard.
- Feedback submitted after an innovation answer can be shared to the public Overview and Collaborations sections after it is stored as reviewed.
- Collaborations includes Ready-To-Wear Orly Store as a trusted client using Smart Monitoring System.

### Contact and demo requests

- Updated the direct contact email to `jaybe.gubot01@gmail.com`.
- Added validation for required fields, email format, and message length.
- Stores contact messages in Supabase.
- Sends messages through Nodemailer and SMTP when production mail variables are configured.
- Added “Book a free demo” buttons to project sections.
- Added project selection for Smart Monitoring System and EduKonekta.
- Stores demo requests as contact records and shows them in the user dashboard.
- Uses `replyTo` so replies can be sent directly to the visitor.

## 6. Data and privacy

The application uses the following primary data areas:

| Table | Purpose |
| --- | --- |
| `users` | User profiles and hashed email-password credentials. |
| `contacts` | Contact messages and free demo requests. |
| `feedback` | Authenticated user feedback and ratings. |
| `recommendations` | Recommendations submitted by authenticated users. |
| `innovation_answers` | Open answers and quick-challenge results. |
| `innovation_votes` | One-vote-per-user records for answers. |

Privacy protections implemented in the product include:

- Required consent notice referencing the Philippine Data Privacy Act of 2012, Republic Act No. 10173.
- Clear explanation of why account data is used.
- Minimum necessary account information for personalization and attribution.
- JWT verification before protected actions.
- Password hashing with bcryptjs.
- Server-side validation for account, feedback, innovation, and contact inputs.
- Sensitive server credentials kept in environment variables.
- No production secrets documented in this file.

The privacy notice is a product feature, not a substitute for a complete legal review or a formal privacy compliance program. For a production organization, the privacy policy, retention process, data-subject request process, and security controls should be reviewed with a qualified privacy professional.

## 7. Environment and deployment

### Local development

Create `.env.local` in the project root. Do not commit it.

Typical values include:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-server-side-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-public-key
JWT_SECRET=your-long-random-secret
CONTACT_RECIPIENT_EMAIL=jaybe.gubot01@gmail.com
SMTP_HOST=your-smtp-host
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
SMTP_FROM_EMAIL=your-sender@example.com
NODE_ENV=development
```

The server-side Supabase key and SMTP password must never be exposed in client-side code or committed to GitHub.

### Commands

```powershell
npm.cmd install
npm.cmd run dev
```

The development site is normally available at `http://localhost:3000`.

To verify a production build locally:

```powershell
npm.cmd run build
npm.cmd run start
```

### Vercel deployment

The production deployment uses Vercel with the Next.js build command:

```text
npm run build
```

Deployment checklist:

1. Push the current source to GitHub.
2. Import or connect the repository in Vercel.
3. Add the required environment variables to the correct Vercel environments.
4. Run all required Supabase SQL migrations.
5. Confirm Google OAuth redirect URLs if Google sign-in is enabled.
6. Deploy and inspect the Vercel build output.
7. Test account creation, login, feedback, innovation answers, demo requests, and email delivery.

The application currently uses twelve API route handlers, which keeps it within the previously identified Vercel Hobby function limit.

## 8. What has been accomplished

The project has progressed through several major stages:

1. Started as a static portfolio with separate pages and visual content.
2. Migrated the primary frontend to React and Next.js.
3. Consolidated page routing and backend actions into one Next.js application.
4. Rebranded the site as JVerse and standardized the page naming system.
5. Built a reusable responsive design system with dark and light themes.
6. Added authentication, privacy consent, and personalized accounts.
7. Added persistent data with Supabase and PostgreSQL.
8. Added public feedback, ratings, and scrollable community feedback.
9. Added personal dashboards for user activity and progress.
10. Created Voices of Innovation with categories, levels, scoring, badges, voting, and ranks.
11. Added free demo booking and direct contact email delivery.
12. Added a professional website assistant that answers questions and links visitors to relevant pages.
13. Added deployment documentation and verified successful production builds.

The result is more than a portfolio landing page. It is a personal brand platform, project showcase, community learning space, and working full-stack application.

## 9. What I learned

### Frontend and product design

- A good interface is not only about colors and effects; spacing, hierarchy, readability, and responsive behavior matter more.
- Reusable React components make it easier to keep navigation, forms, cards, feedback, and account behavior consistent.
- A design system built from CSS variables makes dark and light themes easier to maintain.
- Mobile navigation needs separate interaction rules because hover-based desktop menus can create hidden clickable elements on small screens.
- Scroll animations should support the content and respect users who prefer reduced motion.
- Browser autoplay rules affect video with sound, so controls and graceful fallbacks are necessary.

### React and Next.js

- Next.js App Router can keep pages and server-side API actions in one codebase.
- Client components are appropriate for interactive forms, theme controls, assistant conversations, and live state.
- Server route handlers are the right place for secrets, authentication checks, validation, database writes, and email delivery.
- Page metadata must be defined per route when the browser tab and search result title need to match the current page.
- TypeScript catches mismatches between UI data, API responses, database fields, and leaderboard calculations before deployment.

### Authentication and security

- Authentication is more than creating a login form; every protected action must verify the token on the server.
- Passwords must be hashed and never stored as plain text.
- Privacy consent must be validated on the server, not only represented by a checked browser checkbox.
- Public read operations and authenticated write operations should have different access rules.
- Environment variables are necessary for protecting database, JWT, and SMTP credentials.

### Databases and backend design

- A database schema must evolve together with application types and validation rules.
- Adding new innovation categories required both code changes and a Supabase constraint migration.
- Storing `username` with an answer makes public leaderboards fast, but profile-name updates must also propagate to previous records.
- Duplicate votes and repeated quick challenges require server-side safeguards.
- A transparent rubric is useful when a paid AI service is not necessary for the product experience.

### Deployment and operations

- A successful local build does not guarantee a successful deployment; environment variables, database schema, function limits, and email configuration also matter.
- Vercel route counts and plan limits should be considered when adding backend features.
- Database migrations must be applied before users can use newly released features.
- Contact forms are only truly complete when SMTP delivery, reply handling, and failure states are tested in production.
- Build logs are valuable evidence when diagnosing TypeScript, route, database, or deployment issues.

### Personal development

- Building real systems teaches more than following isolated tutorials.
- A developer often works as a designer, analyst, tester, documenter, communicator, and problem solver.
- Debugging is part of product development, not evidence that the project is failing.
- Every new feature should be connected to a real user need.
- Clear documentation makes future maintenance, deployment, and collaboration easier.

## 10. Recommended next improvements

These are logical future improvements, not requirements for the current build:

- Add automated unit and integration tests for authentication, scoring, and API validation.
- Add rate limiting and abuse monitoring for public forms and voting.
- Add pagination or cursor-based loading if feedback or innovation data grows significantly.
- Add a formal privacy policy page and documented data retention/deletion workflow.
- Add transactional email templates for contact confirmations and demo-request updates.
- Add database indexes and query monitoring as user activity increases.
- Add a content management workflow for editing projects without changing code.
- Add analytics with privacy-conscious configuration.
- Add Docker development configuration if the project must run outside Vercel.
- Evaluate Kubernetes only when traffic, service count, or operational requirements justify the added complexity.

## 11. Key references in this repository

- `SOFTWARE_STACK.md` - earlier stack reference.
- `SUPABASE_VERCEL_SETUP.md` - Supabase and Vercel setup notes.
- `database-setup-supabase.sql` - primary database setup.
- `database-add-feedback-rating.sql` - feedback rating migration.
- `database-add-voices-of-innovation.sql` - initial innovation feature migration.
- `database-expand-innovation-categories.sql` - expanded real-world category migration.
- `app/layout.tsx` - global metadata and application shell.
- `components/site-shell.tsx` - navigation, theme control, account link, and assistant placement.
- `components/innovation-hub.tsx` - challenge submission and leaderboard interface.
- `components/account-panel.tsx` - authentication and personal dashboard interface.
- `components/feedback-section.tsx` - public feedback display and submission form.
- `app/api/innovation/route.ts` - innovation data and scoring actions.
- `app/api/contact-form/route.ts` - contact and email delivery workflow.

## 12. Closing summary

JVerse demonstrates a practical full-stack development journey: starting with a personal portfolio, then expanding it into a polished, interactive platform that explains work, supports users, stores real participation, and creates opportunities for future collaboration.

The most important accomplishment is not a single page or technology. It is learning how design, frontend development, backend logic, databases, authentication, privacy, deployment, documentation, and user needs must work together to create a dependable product.
