# Frontend Project Documentation

## 1. Project Purpose

This frontend is the client application for the coding platform. It provides:

- onboarding and authentication for end users and administrators
- protected user workflows for coding, problem browsing, submission review, and profile management
- an admin view for dashboard and management features
- an extendable structure for new pages, API interactions, and feature slices

This document is intended for developers who will maintain, extend, or onboard onto the frontend codebase.

## 2. Quick start

### 2.1 Prerequisites

- Node.js 18 or later
- npm 9 or later
- A code editor like VS Code
- Backend API available and reachable via `VITE_API_URL`

### 2.2 Install dependencies

```bash
npm install
```

### 2.3 Configure environment variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8000/api
```

Update the URL to match the backend environment used during development.

### 2.4 Start the app locally

```bash
npm run dev
```

Open the local development URL shown by Vite, usually `http://localhost:5173`.

### 2.5 Build for production

```bash
npm run build
```

### 2.6 Preview production output

```bash
npm run preview
```

### 2.7 Lint the app

```bash
npm run lint
```

## 3. Technology stack

- React 19
- TypeScript 6
- Vite 8
- Redux Toolkit
- React Router DOM 7
- Tailwind CSS 4
- Axios
- shadcn UI utilities
- Phosphor icons

## 4. Repository structure

```
frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── router.tsx
│   │   └── store.ts
│   ├── components/
│   │   ├── layouts/
│   │   │   ├── admin-layout.tsx
│   │   │   └── app-layout.tsx
│   │   └── ui/
│   ├── config/
│   │   ├── app-config.ts
│   │   └── env.ts
│   ├── context/
│   ├── features/
│   │   └── auth/
│   │       └── slice/authSlice.ts
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   │   ├── admin/
│   │   ├── app/
│   │   └── auth/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── doc.md
```

## 5. Application architecture

### 5.1 Entry point

- `src/main.tsx` is the application bootstrap.
- It renders `<App />` inside `ReactDOM.createRoot`.
- The app is wrapped with:
  - `Provider` from Redux Toolkit
  - `BrowserRouter` from React Router

### 5.2 Top-level app

- `src/App.tsx` is the top-level component.
- It currently sets a dummy user object in `localStorage` for local development.
- The component renders `AppRoutes`.

### 5.3 Route hierarchy

Routes are defined in `src/app/router.tsx`:

- Public routes:
  - `/`
  - `/login`
  - `/register`
  - `/forgot-password`
  - `/reset-password`
- User routes under `AppLayout`:
  - `/app`
  - `/app/problems`
  - `/app/problems/:id`
  - `/app/submissions`
  - `/app/profile`
- Admin routes under `AdminLayout`:
  - `/admin`
- Fallback route:
  - `*`

### 5.4 Route protection

Route guards are implemented in `src/routes/`:

- `PublicRoutes` allows unauthenticated users in and redirects authenticated users to the correct area.
- `UserRoutes` allows only authenticated users with `role === "USER"`.
- `AdminRoutes` allows only authenticated users with `role === "ADMIN"`.

The guards use Redux state from `src/features/auth/slice/authSlice.ts`.

### 5.5 Layout components

- `src/components/layouts/app-layout.tsx` is the wrapper for user pages.
- `src/components/layouts/admin-layout.tsx` is the wrapper for admin pages.
- Both use `Outlet` from React Router to render child routes.

## 6. Authentication and state management

### 6.1 Auth state

The auth slice defines:

- `isAuthenticated`: boolean
- `user`: object or `null`

`src/features/auth/slice/authSlice.ts` initializes state from `localStorage`.

### 6.2 Local persistence

The auth reducer saves and removes the user in `localStorage`:

- `login` stores the authenticated user.
- `logout` clears the user.

### 6.3 Current placeholder behavior

`src/App.tsx` currently writes a fake user into `localStorage` on mount. This is only a development placeholder and should be removed when real authentication is wired.

## 7. API and HTTP client

### 7.1 Axios setup

`src/services/axios-interceptor.ts` exports an Axios instance configured with:

- `baseURL: import.meta.env.VITE_API_URL`
- `withCredentials: true`
- `Content-Type: application/json`

### 7.2 Environment variable

Add the backend URL in `.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

If backend authentication uses cookies or sessions, `withCredentials: true` supports those cookies.

## 8. Styling and UI

- `src/index.css` is the global stylesheet imported by `src/main.tsx`.
- Tailwind CSS is used for styling.
- `@fontsource-variable/jetbrains-mono` provides the JetBrains Mono font.
- `@phosphor-icons/react` provides icon components.
- shadcn and `tailwind-merge` are available for utility-based design.

## 9. Development guidelines

### 9.1 Adding a new page

1. Create a file in `src/pages/` or a nested folder.
2. Add the route to `src/app/router.tsx`.
3. Choose the correct guard:
   - public: `PublicRoutes`
   - user pages: `UserRoutes`
   - admin pages: `AdminRoutes`
4. Wrap authenticated pages with `AppLayout` or `AdminLayout`.
5. Add navigation updates to the appropriate layout.

### 9.2 Adding a feature state slice

1. Create a new slice in `src/features/<feature>/slice/`.
2. Export actions and reducer from the slice.
3. Register the reducer in `src/app/store.ts`.
4. Use typed hooks or `useSelector` in components.

### 9.3 Adding an API service

1. Create a service file in `src/services/` or `src/features/<feature>/api/`.
2. Import the axios instance from `src/services/axios-interceptor.ts`.
3. Keep API logic separate from UI components.

### 9.4 Using shared UI / components

- Put reusable, presentational components in `src/components/ui/`.
- Put layout components in `src/components/layouts/`.
- Keep page-specific components inside the corresponding `src/pages/` folder.

### 9.5 Naming conventions

- Files and folders: `kebab-case`.
- React component files: `PascalCase` names with default exports.
- Hooks: `useXyz.ts`.
- Types and interfaces: `PascalCase` and stored in `src/types/`.
- Redux slices: feature-based directories under `src/features`.

## 10. Troubleshooting

### 10.1 Missing API URL

If Vite fails with `undefined` for `VITE_API_URL`, verify that `.env` exists and the variable is correctly defined.

### 10.2 Route redirect loops

If login redirects keep firing, check:

- `auth` state in Redux
- `localStorage` user value
- guard logic in `src/routes/*.tsx`

## 14. Onboarding checklist

For a new developer joining the team:

- run `npm install`
- create `.env` with `VITE_API_URL`
- run `npm run dev`
- inspect `src/app/router.tsx` and `src/routes/`
- inspect `src/features/auth/slice/authSlice.ts`
- review placeholder auth setup in `src/App.tsx`
- review the `src/pages/` folder to understand current screens

---
