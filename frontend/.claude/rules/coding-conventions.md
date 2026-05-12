# Coding Conventions

## Component structure
- Functional components with hooks only — no class components.
- One component per file; file name matches the exported component name (PascalCase).
- Pages: `src/pages/<Name>/<Name>Page.jsx`
- Reusable components: `src/components/<Name>.jsx`

## Naming
- Components and files: PascalCase (`DashboardPage`, `NotificationToast`)
- Hooks: camelCase prefixed with `use` (`useApi`, `useAuth`)
- Services/utilities: camelCase (`apiService`, `tokenStorage`)
- CSS classes: Tailwind utilities only — no custom class names unless adding to `src/index.css`

## Auth guard pattern (protected pages)
Every protected page must redirect unauthenticated users explicitly. Do not rely on a wrapper component or `AuthContext` to do it:

```jsx
const { isAuthenticated, authLoading } = useAuth();
const navigate = useNavigate();

useEffect(() => {
  if (!authLoading && !isAuthenticated) {
    navigate('/sign-in');
  }
}, [isAuthenticated, authLoading, navigate]);

if (authLoading) return <Loader />;
```

## User feedback
- Loading: `<Loader />` (`src/components/Loader.jsx`)
- Notifications/errors: `<NotificationToast />` (`src/components/NotificationToast.jsx`)
- Forms: `<ActionButton />` for submit actions (`src/components/Buttons/`)

## Routing
All routes are registered in `src/App.jsx`. Public routes come first, protected routes follow. Use `useNavigate` for programmatic navigation — never manipulate `window.location` directly.

## State management
Use React Context (`AuthContext`) for global auth state. Local component state uses `useState`/`useReducer`. There is no Redux or Zustand — do not introduce a new global state library without discussion.

## No direct axios usage in components
Import and use `apiService` methods or `useApi`. Never import `axios` in a component or page file.
