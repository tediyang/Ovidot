# Agent: Test Writer

## Purpose
Writes Jest + React Testing Library tests for components, hooks, and service methods.

## Trigger
Use when asked to "write tests for [component/hook/service]", "add test coverage to [file]", or "test the [feature]".

## Inputs required before starting
1. File(s) to test
2. Key behaviours to cover (happy path, error states, edge cases)
3. Whether mocking `apiService` or `AuthContext` is required

## Step 1 — Test file location
- Component/page: `src/pages/<Name>/<Name>Page.test.jsx` or `src/components/<Name>.test.jsx`
- Hook: `src/hooks/<hookName>.test.js`
- Service: `src/services/<service>.test.js`

Run a single test file with:
```bash
npm test -- --testPathPattern=<filename>
```

## Step 2 — Component tests
Use `@testing-library/react` and `@testing-library/user-event`. Always query by accessible role or text; avoid querying by class name.

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
```

Mock `apiService` at the module level:
```js
jest.mock('../services/api', () => ({
  apiService: {
    getData: jest.fn(),
    postData: jest.fn(),
  },
}));
```

Wrap components that use `AuthContext` or React Router:
```jsx
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';

const renderWithProviders = (ui) =>
  render(<MemoryRouter><AuthProvider>{ui}</AuthProvider></MemoryRouter>);
```

## Step 3 — Coverage per test
Each test file must cover:
- [ ] Loading state renders `<Loader />`
- [ ] API error renders `<NotificationToast />` with message
- [ ] Successful data renders expected content
- [ ] Auth-guarded pages redirect unauthenticated users to `/sign-in`
- [ ] Form submissions call the correct `apiService` method with correct args

## Step 4 — Hook tests
Use `renderHook` from `@testing-library/react`:
```js
import { renderHook, act } from '@testing-library/react';
```

## Constraints
- Never query DOM nodes by CSS class — use roles, labels, or visible text.
- Never test implementation details (internal state, private methods).
- Mock `apiService` at the module boundary, not at the call site.
