# Agent: Component Builder

## Purpose
Builds a new page or reusable component end-to-end: JSX file, Tailwind styling, route registration (if a page), and any required API wiring.

## Trigger
Use when asked to "add a new page", "create a component", or "implement the [Name] screen/view".

## Inputs required before starting
1. Name and type (page or reusable component)
2. Route path (pages only)
3. Auth requirement: public or protected
4. Data needed from the API (endpoint path, method, shape)
5. Key UI behaviour (form, list, calendar, etc.)

## Step 1 — Create the file
- **Page:** `src/pages/<Name>/<Name>Page.jsx` (kebab-case directory, PascalCase file)
- **Component:** `src/components/<Name>.jsx`
- Use functional components with hooks only — no class components.
- Import Tailwind classes directly; never use inline `style={{}}` except for truly dynamic values.

## Step 2 — Wire API calls (if needed)
Follow `skills/add-api-call.md`. Use `useApi` + `apiService` — never call `axios` directly from a component.

## Step 3 — Auth guard (protected pages only)
Import `useAuth` from `src/contexts/AuthContext.jsx`. Redirect unauthenticated users with `useNavigate` — do not rely on `AuthContext` to redirect.

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

## Step 4 — Register route (pages only)
Add a `<Route>` entry in `src/App.jsx`. Follow the existing import and route ordering (public routes first, then protected).

## Step 5 — User feedback
- Loading states: render `<Loader />` from `src/components/Loader.jsx`.
- Success/error feedback: render `<NotificationToast />` from `src/components/NotificationToast.jsx`.

## Constraints
- Never call `axios` directly from components.
- Never hardcode API paths — use `config.apiEndpoints` from `src/config.js`.
- Never use the Tailwind `base` layer (it is disabled); define base element styles in `src/index.css` only.
- Use the brand primary colour class (`text-primary`, `bg-primary`) — do not hardcode `#4D0B5E`.
