# Frontend Documentation

This document describes the `frontend/` application structure, routing, layouts, feature modules, shared UI components, authentication flow, and integration points.

## Overview

The frontend is a Vite-powered React application in `frontend/` built with:
- React 19
- TypeScript 6
- React Router DOM 7
- Redux Toolkit
- Axios
- Tailwind CSS 4
- STOMP WebSocket client
- A shadcn-style shared UI component suite

The app provides:
- a public landing experience
- authentication pages for login, registration, and password recovery
- authenticated user workflows for compiling code, browsing problems, viewing problem details, and reviewing submissions
- an admin panel for managing users, languages, problems, tags, test cases, and hints

## Core App Entry

### `src/main.tsx`
- Bootstraps the app using `ReactDOM.createRoot`.
- Wraps the application in:
  - `WebSocketProvider`
  - Redux `Provider`
  - `ThemeProvider`
  - `BrowserRouter`
- Renders the top-level `App` component.

### `src/App.tsx`
- Wraps routes with `TooltipProvider`.
- Renders `AppRoutes` from `src/app/router.tsx`.

### `src/app/router.tsx`
- Defines the complete route tree and route hierarchy.
- Uses layout wrappers and authorization guards to organize public, user, and admin pages.

## Routing Structure

### Route tree

Public routes:
- `/` → `LandingPage`
- `/login` → `Login`
- `/register` → `Register`
- `/forgot-password` → `ForgotPassword`
- `/reset-password` → `ResetPassword`

Protected user routes:
- `/app/compiler` → `CodeCompiler`
- `/app/problems` → `ProblemSet`
- `/app/problems/:id` → `ProblemDetail`
- `/app/submission/:id` → `ProblemSubmission`
- `/app/profile` → `Profile`

Admin routes:
- `/admin/dashboard` → `Dashboard`
- `/admin/users` → `Users`
- `/admin/languages` → `Languages`
- `/admin/problems` → `Problems`
- `/admin/problems/create` → `ProblemCreate`
- `/admin/problems/update/:id` → `ProblemUpdate`
- `/admin/tags` → `Tags`
- `/admin/problem-examples` → `ProblemExamples`
- `/admin/testcases` → `Testcases`
- `/admin/hints` → `Hints`

Catch-all:
- `*` → `PageNotFound`

### Route wrappers and guards

The application uses nested route wrappers in `src/routes/`:
- `PublicRoutes` redirects authenticated users from public pages to their appropriate app area.
- `ProtectedRoutes` restores the current session by calling `/auth/me` and prevents unauthenticated access.
- `UserRoutes` allows only normal user accounts to access `/app/*` pages.
- `AdminRoutes` allows only admin users to access `/admin/*` pages.

## Layouts and Navigation

### Layout wrappers

- `src/components/layouts/public-layout.tsx`
  - Uses `Navbar` with `variant="public"`.
  - Wraps public pages.

- `src/components/layouts/app-layout.tsx`
  - Uses `Navbar` with `variant="authenticated"`.
  - Wraps authenticated user pages.

- `src/components/layouts/admin-layout.tsx`
  - Renders `AdminSidebar` on the left.
  - Renders admin page content with `Outlet` on the right.

### Navbar

- `src/components/layouts/navbar/navbar.tsx`
  - Handles both public and authenticated navigation.
  - Displays login/register actions for public visitors.
  - Displays a theme toggle, user dropdown, and mobile navigation for authenticated users.
  - Uses `NavDesktop`, `NavMobile`, and `NavUserDropdown` components.

### Admin sidebar

- `src/features/admin/sidebar/admin-sidebar.tsx`
  - Primary admin navigation panel.
- `src/features/admin/sidebar/admin-sidebar-nav.tsx`
  - Defines admin links for:
    - `dashboard`
    - `users`
    - `languages`
    - `problems`
    - `tags`
    - `problem-examples`
    - `testcases`
    - `hints`

## Authentication Flow

### Auth state

- `src/features/auth/slice/authSlice.ts`
  - Manages authentication state with `login` and `logout` reducers.
  - Stores:
    - `isAuthenticated`
    - `user`
- `src/types/auth.ts`
  - Defines `User`, `AuthState`, and `AuthLayoutProps`.

### Auth pages

- `src/features/auth/components/auth-wrapper.tsx`
  - Shared card-based auth layout used by all auth forms.
- `src/pages/auth/login.tsx`
  - Sends credentials to `/auth/login`.
  - Fetches profile data from `/auth/me` after login.
  - Dispatches `login(user)` and redirects based on `user.role`.
- `src/pages/auth/register.tsx`
  - Sends registration requests to `/auth/register`.
  - Redirects to `/login` on success.
- `src/pages/auth/forgot-password.tsx`
  - Dummy UI for requesting a password reset link.
- `src/pages/auth/reset-password.tsx`
  - Dummy UI for setting a new password.

### Session restoration

- `ProtectedRoutes` calls `api.get("/auth/me")` when `isAuthenticated` is false.
- If the API returns valid session data, it dispatches `login(res.data.data)`.
- If the session cannot be restored, it redirects to `/login`.

## Feature Modules

### Code Compiler

- `src/pages/app/code-compiler.tsx`
  - User-facing compiler page.
- `src/features/code-compiler/components/language-sidebar.tsx`
  - Selects compilation language.
- `src/features/code-compiler/components/editor-panel.tsx`
  - Presents the code editor.
- `src/features/code-compiler/components/input-panel.tsx`
  - Provides standard input editing.
- `src/features/code-compiler/components/output-panel.tsx`
  - Displays program output.
- `src/features/code-compiler/slice/compilerSlice.ts`
  - Stores compiler state.
- `src/features/code-compiler/data/dummy-data.ts`
  - Holds sample compiler metadata for development.

### Problem browsing and details

- `src/pages/app/problem-set.tsx`
  - Problem list with search, filter, pagination, and tag sidebar.
  - Queries `/problems` and `/tags`.
- `src/features/problem-set/components/problem-filter.tsx`
  - Search, level filter, and result count.
- `src/features/problem-set/components/problem-table.tsx`
  - Displays paginated problem rows.
- `src/features/problem-set/components/stats-bar.tsx`
  - Shows top-level progress statistics.
- `src/features/problem-set/data/dummy-problems.ts`
  - Sample problem data.

- `src/pages/app/problem-detail.tsx`
  - Problem details page with code editor, output view, and submission history.
- `src/features/problem-detail/components/problem-panel.tsx`
  - Renders problem description, tags, and metadata.
- `src/features/problem-detail/components/editor-panel.tsx`
  - Problem-specific code editor.
- `src/features/problem-detail/components/output-panel.tsx`
  - Shows compile and execution output.
- `src/features/problem-detail/components/submissions-tab.tsx`
  - Displays the problem's submissions list.
- `src/features/problem-detail/slice/ProblemEditorSlice.tsx`
  - Manages editor-related state.
- `src/features/problem-detail/data/dummy-problem-details.ts`
  - Example problem detail content.

### Submission review

- `src/pages/app/problem-submission.tsx`
  - Detailed submission page by ID.
- `src/features/submission/components/submission-header.tsx`
  - Submission metadata header.
- `src/features/submission/components/sourcecode-panel.tsx`
  - Shows submitted source code.
- `src/features/submission/components/submission-overview.tsx`
  - Overview of verdict, runtime, and memory.
- `src/features/submission/components/testcase-results.tsx`
  - Renders test case pass/fail results.
- `src/features/submission/data/dummy-submission.ts`
  - Dummy submission data.

### Profile

- `src/pages/app/profile.tsx`
  - Displays authenticated user profile information.

### Landing page

- `src/pages/landing-page.tsx`
  - Public marketing page.
  - Includes hero, statistics, feature blocks, and example problem previews.

### 404 page

- `src/pages/page-not-found.tsx`
  - Rendered for unmatched route paths.

## Admin Panel

### Admin page views

- `src/pages/admin/dashboard.tsx`
  - Main admin dashboard placeholder.
- `src/pages/admin/users.tsx`
  - User management page.
- `src/pages/admin/languages.tsx`
  - Supported languages management.
- `src/pages/admin/problems.tsx`
  - Problem administration list.
- `src/pages/admin/tags.tsx`
  - Tag list and search.
- `src/pages/admin/problem-examples.tsx`
  - Problem example management.
- `src/pages/admin/testcases.tsx`
  - Problem test case management.
- `src/pages/admin/hints.tsx`
  - Problem hint management.

### Admin feature components

Admin CRUD workflows are organized under `src/features/admin/components/`.

#### Problems
- `problem/problem-create.tsx`
- `problem/problem-update.tsx`
- `problem/problem-delete.tsx`
- `problem/problem-form.tsx`

#### Languages
- `language/language-create.tsx`
- `language/language-update.tsx`
- `language/language-delete.tsx`
- `language/language-form.tsx`

#### Tags
- `tag/tag-create.tsx`
- `tag/tag-update.tsx`
- `tag/tag-delete.tsx`
- `tag/types.ts`

#### Problem examples
- `problem-example/problem-example-create.tsx`
- `problem-example/problem-example-update.tsx`
- `problem-example/problem-example-delete.tsx`
- `problem-example/problem-example-form.tsx`

#### Test cases
- `testcase/testcase-create.tsx`
- `testcase/testcase-update.tsx`
- `testcase/testcase-delete.tsx`

#### Hints
- `hint/hint-create.tsx`
- `hint/hint-update.tsx`
- `hint/hint-delete.tsx`

#### Users
- `user/user-block-dialog.tsx`
- `user/user-unblock-dialog.tsx`
- `user/user-delete-dialog.tsx`
- `user/types.ts`

## Shared UI Component Library

The shared UI components live in `src/components/ui/` and provide reusable building blocks.

Includes:
- `alert-dialog.tsx`
- `avatar.tsx`
- `badge.tsx`
- `button.tsx`
- `card.tsx`
- `checkbox.tsx`
- `dialog.tsx`
- `dropdown-menu.tsx`
- `field.tsx`
- `input.tsx`
- `label.tsx`
- `progress.tsx`
- `resizable.tsx`
- `scroll-area.tsx`
- `select.tsx`
- `separator.tsx`
- `sheet.tsx`
- `skeleton.tsx`
- `sonner.tsx`
- `spinner.tsx`
- `switch.tsx`
- `table.tsx`
- `tabs.tsx`
- `textarea.tsx`
- `tooltip.tsx`

These components are used by pages, dialogs, admin tables, form flows, and layout shells.

## State Management

### Redux store

- `src/app/store.ts`
  - Registers the `auth`, `compiler`, and `problemEditor` reducers.

### Redux slices

- `src/features/auth/slice/authSlice.ts`
- `src/features/code-compiler/slice/compilerSlice.ts`
- `src/features/problem-detail/slice/ProblemEditorSlice.tsx`

## Network and API

### Axios client

- `src/services/axios-interceptor.ts`
  - Creates an Axios instance with:
    - `baseURL` from `VITE_API_URL`
    - `withCredentials: true`
  - Handles 401 responses by retrying with refresh token logic.
  - Avoids retrying login/register/refresh requests.

### Expected API endpoints

The frontend references backend endpoints such as:
- `/auth/login`
- `/auth/register`
- `/auth/logout`
- `/auth/me`
- `/auth/refresh`
- `/problems`
- `/problems/:id`
- `/problems/:id/hints`
- `/problems/:id/testcases`
- `/tags`
- `/languages`
- `/admin/users`

Admin pages also use entity-specific CRUD endpoints through dialog components.

## Context and Providers

- `src/app/websocket-provider.tsx`
  - Configures a STOMP client using `VITE_WS_URL`.
  - Activates the socket on mount and deactivates it on cleanup.
  - Logs connection and error lifecycle events.

- `src/context/theme-context.tsx`
  - Persists `light` or `dark` theme in `localStorage`.
  - Applies the theme by toggling classes on `document.documentElement`.

- `src/hooks/use-theme.ts`
  - Convenience hook for theme context.

## Environment Variables

The app uses environment variables from Vite:
- `VITE_API_URL` — API base URL for Axios requests.
- `VITE_WS_URL` — WebSocket base URL for STOMP.

## Folder Structure

- `src/app/` — router, store, and application-level providers.
- `src/components/layouts/` — layout shells and navigation wrappers.
- `src/components/ui/` — reusable UI primitives.
- `src/config/` — configuration files.
- `src/context/` — React context providers.
- `src/features/` — feature modules organized by domain.
- `src/hooks/` — custom hooks.
- `src/lib/` — utility functions.
- `src/pages/` — route page components.
- `src/routes/` — route guard components and route composition.
- `src/services/` — shared API and network clients.
- `src/types/` — TypeScript definitions.

## Developer Notes

### Adding a new public route
1. Add the page component in `src/pages/`.
2. Add the route to `src/app/router.tsx` under `PublicRoutes`.
3. Use `PublicLayout` for the public route wrapper.

### Adding a new authenticated user route
1. Add the page component in `src/pages/app/`.
2. Add the route under `/app` in `src/app/router.tsx`.
3. Wrap it with `UserRoutes` and `AppLayout`.

### Adding a new admin route
1. Add the page component in `src/pages/admin/`.
2. Add the route under `/admin` in `src/app/router.tsx`.
3. Wrap it with `AdminRoutes` and `AdminLayout`.
4. Add a sidebar link in `src/features/admin/sidebar/admin-sidebar-nav.tsx` if needed.

### Extending shared UI
- Place new reusable UI components under `src/components/ui/`.
- Keep shared logic and presentational details separate from page-specific code.

### Extending Redux
1. Create a slice in `src/features/<feature>/slice/`.
2. Register it in `src/app/store.ts`.
3. Use typed dispatch and selectors from `src/app/store.ts`.

## Summary

The frontend is structured to separate public content, authenticated user experiences, and admin functionality. The route hierarchy is explicit and guarded by role-based wrappers. Shared UI components and feature modules encourage reusable patterns and consistent styling.

For any frontend update, start with `src/app/router.tsx` and the corresponding layout or guard in `src/routes/`.
