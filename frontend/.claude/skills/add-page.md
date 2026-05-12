# Skill: Add New Page

Use this skill when asked to add a new route/page.

## Steps

1. **Create the page file** at `src/pages/<Name>/<Name>Page.jsx`
   - Functional component, default export.
   - If protected, add the auth guard (see `rules/coding-conventions.md`).

2. **Register the route** in `src/App.jsx`
   - Add the import at the top with other page imports.
   - Add `<Route path="/your-path" element={<YourPage />} />` inside `<Routes>`.
   - Public routes first, protected routes after.

3. **Add navigation links** (if needed)
   - Update `src/components/Header.jsx`, `AsideMenu.jsx`, or `MobileMenu.jsx` with the new path.

4. **Wire API data** (if needed) — follow `skills/add-api-call.md`.

## Checklist
- [ ] Page file created in correct directory
- [ ] Auth guard added for protected pages (redirects to `/sign-in`)
- [ ] `<Loader />` shown while `authLoading` is true
- [ ] Route registered in `src/App.jsx`
- [ ] Navigation updated if the page should be reachable from the menu
