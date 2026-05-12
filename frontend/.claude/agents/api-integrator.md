# Agent: API Integrator

## Purpose
Wires a new backend endpoint into the frontend end-to-end: config entry, service method, hook usage, and component rendering with loading/error states.

## Trigger
Use when asked to "call the [endpoint] API", "fetch [resource] from the backend", or "integrate the [feature] endpoint".

## Inputs required before starting
1. Endpoint path (e.g., `/auth/cycles/stats`)
2. HTTP method (GET / POST / PUT / DELETE)
3. Auth requirement: public or authenticated
4. Request payload shape (POST/PUT only)
5. Expected response shape
6. Component(s) that will consume the data

## Step 1 — Register endpoint in config
Add the path to the correct group in `src/config.js`:
- Unauthenticated endpoints → `config.apiEndpoints.general`
- Authenticated endpoints → `config.apiEndpoints.auth`

Never hardcode a path string inside a service method or component.

## Step 2 — Add service method
Add a method to `src/services/api.js` using the appropriate base method:

| Operation | Base method |
|-----------|-------------|
| Fetch data | `this.getData(path)` |
| Create | `this.postData(path, data)` |
| Update | `this.putData(path, id, data)` |
| Delete | `this.deleteData(path, id)` |

```js
async fetchCycleStats() {
  return this.getData(config.apiEndpoints.auth.cycleStats);
}
```

## Step 3 — Call from component via useApi
```jsx
const { callApi, loading, error } = useApi();

useEffect(() => {
  callApi(apiService.fetchCycleStats.bind(apiService))
    .then(data => setStats(data))
    .catch(() => {}); // error already set by useApi
}, []);
```

- Always use `callApi` from `useApi()` — do not call `apiService` methods directly without it.
- On 401, `ApiService` clears tokens automatically; redirect to `/sign-in` in the catch block if needed.

## Step 4 — Render states in the component
- While `loading` is true: render `<Loader />`.
- While `error` is set: render `<NotificationToast />` with the error message.
- On success: render the data.

## Constraints
- Never import `axios` directly in components or pages.
- Never add a new endpoint path outside `src/config.js`.
- The `second_chance` token refresh is handled automatically by `ApiService`; do not implement it again.
