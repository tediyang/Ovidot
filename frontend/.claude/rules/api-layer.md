# API Layer Rules

## ApiService (`src/services/api.js`)
`apiService` is a singleton. Never instantiate `new ApiService()` — always import the exported singleton.

Use these methods for all HTTP calls from within the service:

| Method | Signature | Use for |
|--------|-----------|---------|
| `getData` | `getData(path)` | GET |
| `postData` | `postData(path, data)` | POST |
| `putData` | `putData(path, id, data)` | PUT (appends `/${id}` to path) |
| `deleteData` | `deleteData(path, id)` | DELETE (appends `/${id}` to path) |

`login()` and `register()` are the only methods that handle tokens directly — do not call `tokenStorage` from components.

## Token refresh
`ApiService.sendRequest` automatically retries once on 401 when the backend sets `second_chance: true` in the response. Do not add retry logic in components. On a failed refresh, tokens are cleared and an error is thrown — catch it and redirect to `/sign-in`.

## TokenStorage (`src/services/storage.js`)
`tokenStorage` is a singleton that syncs with `localStorage`. Keys are defined in `src/config.js` (`tokenStorageKey`, `refreshTokenStorageKey`). Never access `localStorage` for auth tokens directly — always go through `tokenStorage`.

## useApi hook (`src/hooks/useApi.js`)
All component-level API calls must go through `useApi`:

```jsx
const { callApi, loading, error } = useApi();
callApi(apiService.someMethod.bind(apiService), ...args)
```

`callApi` manages `loading` and `error` state. Never manage these manually when `useApi` is available.

## Endpoint paths
All paths live in `src/config.js` under `config.apiEndpoints`. Never hardcode a path string anywhere else. When the backend adds a new endpoint, add the path to the correct group (`general` for public, `auth` for authenticated) before using it.
