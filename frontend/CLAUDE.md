# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Development server (http://localhost:3000)
npm run build      # Production build
npm test           # Run all tests (Jest + React Testing Library)
npm test -- --testPathPattern=<file>  # Run a single test file
```

ESLint runs automatically via `react-scripts`; no separate lint command is defined.

## Environment

Create `src/.env` with:
```
REACT_APP_BACKEND_URL=http://localhost:1245
REACT_APP_ENVIRONMENT=development
REACT_APP_PREFIX=/api/v1
```

The backend defaults to `http://localhost:1245` if `REACT_APP_BACKEND_URL` is unset.

## .claude/ directory

Detailed guidance is broken into:

| Path | Contents |
|------|----------|
| `.claude/agents/component-builder.md` | Build a new page or component end-to-end |
| `.claude/agents/api-integrator.md` | Wire a new backend endpoint into the frontend |
| `.claude/agents/test-writer.md` | Write Jest + RTL tests for components/hooks |
| `.claude/rules/api-layer.md` | ApiService, useApi, TokenStorage usage rules |
| `.claude/rules/coding-conventions.md` | Component structure, auth guard, state management |
| `.claude/rules/styling.md` | Tailwind config, brand tokens, custom theme |
| `.claude/skills/add-page.md` | Step-by-step: add a new route/page |
| `.claude/skills/add-api-call.md` | Step-by-step: wire a new API endpoint |
| `.claude/skills/add-component.md` | Step-by-step: add a reusable component |

## Architecture

**Stack:** React 18 (Create React App), React Router v7, Tailwind CSS, Axios, FullCalendar

### API Layer (`src/services/`)

`ApiService` is a singleton axios wrapper in [api.js](src/services/api.js). All HTTP calls go through it. It automatically injects the Bearer token and handles 401s by attempting a token refresh and retrying the original request once (guarded by the `second_chance` flag to prevent infinite loops). `TokenStorage` (in [storage.js](src/services/storage.js)) manages access and refresh tokens in `localStorage`.

`useApi` ([src/hooks/useApi.js](src/hooks/useApi.js)) wraps `ApiService` calls with `loading` and `error` states for use inside components.

### Auth State (`src/contexts/AuthContext.jsx`)

`AuthContext` holds the authenticated user and loading flag. It validates the stored token and fetches the user profile on mount. Consume it with `useAuth()`. The context does **not** handle routing redirects — components are responsible for redirecting unauthenticated users.

### Routing (`src/App.jsx`)

Routes are split into public (`/`, `/about`, `/help`, `/sign-in`, `/sign-up`, `/forget-password`, `/reset-password/:token`) and protected (`/dashboard`, `/profile`, `/settings`). Protected routes check auth state internally.

### Pages and Components

Pages live under [src/pages/](src/pages/) grouped by route (e.g., `Dashboard/`, `Profile/`). Reusable UI pieces live in [src/components/](src/components/). The Dashboard page is the primary feature surface: it uses FullCalendar for cycle/period visualisation and has `DashboardHeader`, `DashboardBody`, and `DashboardCalendar` sub-components.

### Styling

Tailwind CSS with a custom theme in `tailwind.config.js`:
- Primary brand colour: `#4D0B5E`
- Custom breakpoints: `xxsm`, `xsm`, and the standard Tailwind set
- Custom shadows: `evenly`, `info`, `testimonial-card`
- Tailwind base is **disabled**; only utilities and components are enabled. Global base styles are in [src/index.css](src/index.css).
- Font: Cabin (preloaded in `public/index.html`)

### API Endpoints

All endpoint paths are centralised in [src/config.js](src/config.js). When adding a new backend call, define the path there first rather than inlining strings in components.
