# Ovidot Backend

## Overview
REST API for a menstrual cycle tracking application. Built with Node.js/Express, MongoDB, and Redis. Runs on port 1245.

## Tech Stack
- **Runtime:** Node.js (CommonJS modules)
- **Framework:** Express.js
- **Database:** MongoDB 6 + Mongoose ODM
- **Cache:** Redis (20-day TTL)
- **Auth:** JWT (5h access tokens, 7d refresh tokens)
- **Validation:** Joi
- **Email:** Nodemailer (Gmail SMTP) + EJS templates
- **Testing:** Mocha + Chai + Sinon + Supertest

## Commands

```bash
npm install          # Install dependencies
npm start            # Start server (node app.js)
npm run demon        # Dev mode with nodemon (auto-reload)
npm test             # Run Mocha test suite
npm run deploy       # Start with PM2
npm run stop         # Stop PM2 process
docker-compose up    # Full local stack (MongoDB + Redis)
```

## Architecture

```
backend/
├── app.js                    # Entry point, route mounting, super admin init
├── v1/
│   ├── controllers/          # Route handlers (register, user, cycle, password)
│   ├── routes/               # Route definitions
│   │   ├── general.routes.js # Public routes (no auth)
│   │   ├── auth.routes.js    # Protected routes (JWT required)
│   │   └── auth/             # Nested route groups (user, cycle)
│   ├── models/
│   │   ├── engine/database.js # DbStorage class, MongoDB connection
│   │   └── schemas/          # Mongoose schemas (user, cycle, email)
│   ├── admin/                # Admin portal (routes, controller, model)
│   ├── middleware/           # tokenVerification, logger, tokenBlacklist
│   ├── services/             # emailService, notifications, caching (Redis)
│   ├── utility/
│   │   ├── encryption/       # AES-256-GCM (encryption.js), bcrypt (cryptography.js)
│   │   ├── helpers/          # cycle.calculator, cycle.helpers, handle.response
│   │   └── validators/       # Joi schemas (requests.validator, date.validator)
│   ├── tests/
│   │   ├── unit/routes/      # Route-level tests
│   │   └── unit/utility/     # Utility function tests
│   └── libs/boot.js          # Server startup, Redis init, cron jobs
├── docker-compose.yml
├── ecosystem.config.js       # PM2 config
└── blacklist.json            # Logout token blacklist (file-based)
```

## API Structure

All routes are prefixed with `/api/v1/`.

**Public routes** (`/api/v1/`):
- `POST /signup`, `POST /login`
- `POST /forgot-password`, `GET /reset-password/:token`, `PUT /reset-password`
- `GET /refresh-token/:token`

**Protected routes** (`/api/v1/auth/`) — require Bearer JWT:
- `GET /logout`
- Users: `GET /users/fetch`, `PUT /users/update`, `DELETE /users/delete`, `POST /users/deactivate`
- Cycles: `POST /cycles/create`, `GET /cycles/fetch`, `GET /cycles/fetch/:id`, `PUT /cycles/update/:id`, `DELETE /cycles/delete/:id`

**Admin routes** (`/api/v1/admin/`) — require admin JWT.

**Standard response shape:**
```json
{ "message": "...", "data": {} }         // success
{ "message": "...", "error": "..." }     // 500 errors
```

## Environment Variables

Copy `.env.example` or set these in `.env`:

```
# JWT
SECRETKEY=<user_jwt_secret>
ADMINKEY=<admin_jwt_secret>

# Email
EMAIL=<gmail_address>
EMAILPASSWORD=<gmail_app_password>
EMAIL_SERVICE=gmail

# MongoDB
MONGO_URL=<atlas_url>              # production only
DB_TEST=ovidot-test                # dev/test
DB_TEST_USER=ovidot-superadmin
DB_TEST_URI_PWD=<password>
DB_TEST_HOST=127.0.0.1
DB_TEST_PORT=27017

# Redis
REDIS_URL=<render_redis_url>       # production only

# App
PORT=1245
ENVIR=dev|test|production
APP_NAME=ovidot
APP_EMAIL=<super_admin_email>
APP_PWD=<super_admin_password>
APP_DOMAIN=https://ovidot.com
ALLOWED_ORIGIN=*

# Field Encryption (AES-256-GCM)
ENCRYPTION_KEY_V1=<32_char_hex>
ENCRYPTION_SALT_V1=<16_char_hex>
ENCRYPTION_KEY_V2=<32_char_hex>
ENCRYPTION_SALT_V2=<16_char_hex>

# Misc
BLACKLIST=blacklist.json
LIMIT=100
```

**Environment detection:** `ENVIR=dev|test` uses local MongoDB/Redis; `ENVIR=production` uses `MONGO_URL` and `REDIS_URL`.

## Key Patterns

### Authentication
JWT tokens verified by `tokenVerification.js` middleware. Logged-out tokens are blacklisted in `blacklist.json` (also checked in `database.js` on startup).

### Encryption
- **Passwords:** bcrypt (10 rounds) via `utility/encryption/cryptography.js`
- **Sensitive cycle fields** (dates, ovulation): AES-256-GCM via `utility/encryption/encryption.js` with v1/v2 key versioning. Encryption is triggered by Mongoose pre-save hooks; decryption by `toJSON()`.

### Database Access
Centralized `DbStorage` class in `models/engine/database.js` exports `User`, `Cycle`, `Email`, `Admin` model instances. Use these rather than importing schemas directly.

### Response Formatting
Always use `handleResponse(res, statusCode, message, data?)` from `utility/helpers/handle.response.js`.

### Caching
`RedisManager` in `services/caching.js` wraps Redis hash operations. Cache key per user, 20-day TTL.

### Notifications
`services/notifications.js` manages in-app notifications embedded in the User document. Max 50 notifications; oldest are dropped (FIFO).

### Validation
Joi schemas in `utility/validators/requests.validator.js`. Validate at the controller boundary before any DB operations.

## Testing

Tests live in `v1/tests/unit/`. Use Sinon sandboxes to stub `tokenVerification` middleware and external services. Each test file restores stubs in `afterEach`.

```bash
npm test   # runs all tests with 540s timeout
```

## Logging

- Winston writes to `v1/logs/app.log` and `v1/logs/errors.log`
- Morgan logs HTTP requests to console (non-production)
- Swagger UI available at `/api-docs` (see `v1/swagger-docs.js`)
