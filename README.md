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

## Tests

Run the unit tests with Vitest:

```bash
pnpm test
```

Use `pnpm test:watch` while developing. The unit suite covers password hashing/verification and login/registration input validation.

## Deployment

Set `AUTH_SECRET` and `DATABASE_URL` in the deployment environment, and run Prisma migrations as part of deployment. A local SQLite file is suitable for development and single-instance hosting; use a persistent disk or a SQLite-compatible hosted database for production.

See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for platform-specific guidance.
