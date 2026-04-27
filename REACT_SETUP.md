# React Setup Guide

React has been successfully integrated into your Pinkora Dev project!

## Project Structure

```
src/
  ├── main.jsx              # React entry point
  ├── App.jsx               # Main App component
  ├── App.css               # Global styles
  ├── components/           # Reusable components
  │   └── Navbar.jsx
  └── pages/                # Page components
      ├── Home.jsx
      ├── About.jsx
      ├── Services.jsx
      ├── Projects.jsx
      └── Contact.jsx
```

## Available Scripts

### Development
```bash
npm run dev
```
Starts the Vite development server at `http://localhost:5173`

### Build
```bash
npm run build
```
Creates a production-ready build in the `dist/` folder

### Preview
```bash
npm run preview
```
Preview the production build locally

### Server
```bash
npm run server
```
Runs the Express backend server (separate from React dev server)

## Development Workflow

1. **Run React dev server:**
   ```bash
   npm run dev
   ```
   This starts Vite on port 5173

2. **In another terminal, run Express backend:**
   ```bash
   npm run server
   ```
   This starts your Express API on port 3000

3. The React app proxies API requests to `http://localhost:3000/api`

## Features

- **Navigation System** - Built-in page routing in the App component
- **Auth Integration** - Checks authentication status on app load
- **API Proxy** - Vite proxy automatically forwards `/api` calls to your Express backend
- **Responsive Design** - Mobile-friendly navbar and pages
- **Component Structure** - Clean, modular component organization

## Next Steps

1. Replace placeholder components with your actual content
2. Move existing HTML content into React components
3. Convert vanilla JavaScript logic to React hooks
4. Update styling as needed using the imported CSS files

## Notes

- The React app runs on port 5173 (Vite dev server)
- The Express backend runs on port 3000
- API routes are proxied automatically during development
- For production, you'll need to build React and serve from Express
