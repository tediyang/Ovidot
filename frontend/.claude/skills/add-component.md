# Skill: Add Reusable Component

Use this skill when adding a shared UI component to `src/components/`.

## Steps

1. **Create the file** at `src/components/<Name>.jsx`
   - Functional component, named export preferred for components used across multiple pages.
   - Accept all variable content as props — no hardcoded copy or colours.

2. **Style with Tailwind**
   - Use `primary` theme token for brand colours (`bg-primary`, `text-primary`).
   - Use custom shadows (`shadow-evenly`, `shadow-info`) where appropriate.
   - Never use inline `style={{}}` for static values.

3. **Expose a clean props interface**
   - Destructure props at the top of the component.
   - Pass event handlers in (e.g., `onClick`, `onSubmit`) rather than defining them internally when the parent controls the behaviour.

4. **Import and use in the target page/component**
   - Import from `../components/<Name>` (relative path).
   - The component must render correctly in isolation — no dependency on page-level state unless passed as a prop.

## Checklist
- [ ] File created in `src/components/`
- [ ] No hardcoded strings, colours, or API calls inside the component
- [ ] Tailwind-only styling (no inline styles for static values)
- [ ] Props interface is clear and minimal
- [ ] Imported and rendered in the target location
