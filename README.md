This is a [Next.js](https://nextjs.org) project using the App Router, Auth.js credentials authentication, Prisma, and SQLite.

## Getting Started

First, install dependencies and configure the local environment:

```bash
pnpm install
```

Copy `.env.example` to `.env`. Set `AUTH_SECRET` to a random value; for example, generate one with:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

Create the SQLite database and run the initial migration, then start the app:

```bash
pnpm db:migrate --name init
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Register at `/register`, sign in at `/login`, and view the protected profile at `/user`. The SQLite file is created at `prisma/dev.db`.

The authentication flow uses Auth.js Credentials with JWT sessions. Prisma persists users; passwords are stored as scrypt hashes. To update the generated Prisma client after changing the schema, run `pnpm db:generate`.

## Admin dashboard

The `/admin` route is available only to users with `isAdmin = true`. Other visitors are redirected to `/`. New users default to `isAdmin = false`.

Apply the admin-role migration:

```bash
pnpm db:migrate --name add-user-is-admin
```

To grant the first administrator role, start Prisma Studio after applying migrations:

```bash
pnpm exec prisma studio
```

In the `User` table, set `isAdmin` to `true` for the intended account. Admins can then add users (with a temporary password), edit names, emails, and admin roles, or delete accounts. The dashboard prevents admins from removing their own access and from demoting or deleting the last administrator.

## Tests

Run the unit tests with Vitest:

```bash
pnpm test
```

Use `pnpm test:watch` while developing. The unit suite covers password hashing/verification and login/registration input validation.

## Deployment

Set `AUTH_SECRET` and `DATABASE_URL` in the deployment environment, and run Prisma migrations as part of deployment. A local SQLite file is suitable for development and single-instance hosting; use a persistent disk or a SQLite-compatible hosted database for production.

See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for platform-specific guidance.
