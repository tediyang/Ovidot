# Migrations

Use the migration runner to apply database changes in a repeatable way.

## Commands

- npm run migrate
- npm run migrate:down
- npm run migrate:create -- <migration-name>

Each migration file should export an object with `up(db)` and `down(db)` functions.
