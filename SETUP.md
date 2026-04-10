# Setup Instructions

## Step 1: Install Dependencies

Install all dependencies:

```bash
npm install
```

## Step 2: Set Up Environment Variables

This repo expects PostgreSQL via Prisma. Prisma is configured to read:

- `DATABASE_URL` (recommended: pooled connection for runtime)
- `DIRECT_URL` (direct connection for migrations)

Use the template in [.env.example](.env.example).

For day-to-day local work, copy [.env.example](.env.example) to `.env.local` on each machine and fill in the real values there.

Notes:

- Prisma CLI loads `.env` by default. If you only create `.env.local`, Prisma may not see your DB URLs.
- Recommended: put `DATABASE_URL` and `DIRECT_URL` in `.env` for Prisma commands.

If you prefer `.env.local` only, also export the values in your shell before running Prisma commands, or keep a local `.env` for Prisma and `.env.local` for the app.

### Option 1: Using Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a database:

   ```sql
   CREATE DATABASE una_et_hu;
   ```

3. Update `DATABASE_URL` and `DIRECT_URL` in your env setup.
   - `DATABASE_URL` can point at your local DB
   - `DIRECT_URL` can be the same local DB URL

### Option 2: Using Supabase (Recommended)

1. Create a Supabase project.
2. Open Supabase Dashboard → Project Settings → Database → Connection string.
3. Copy both connection strings:

   - **Connection pooling** URI → set as `DATABASE_URL` (good for Next.js runtime)
   - **Direct connection** URI → set as `DIRECT_URL` (required for Prisma migrations)

4. Also set Supabase client env vars if you use uploads:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only, required for the upload API)

5. Make sure your Supabase Storage bucket named `uploads` exists, or allow the server upload route to create it with the service role key.

## Step 3: Generate Prisma Client

After setting up your database, generate the Prisma client:

```bash
npx prisma generate
```

## Step 4: Create Tables

If this is a brand-new database (recommended):

```bash
npx prisma migrate dev --name init
```

If you prefer to avoid migrations (less recommended for production):

```bash
npx prisma db push
```

## Step 5: Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

The website will be available at: **[http://localhost:3000](http://localhost:3000)**

## Step 6: (Optional) Seed the Database

If you want to add some initial data, you can create a seed script later.

## Troubleshooting

### If you get "Cannot find module '@prisma/client'"

Run:

```bash
npx prisma generate
```

### If you get database connection errors

1. Check your `DATABASE_URL` in `.env`
2. Make sure PostgreSQL is running (if using local)
3. Check your firewall settings
4. Verify your database credentials

### If Tailwind CSS is not working

The project uses Tailwind CSS v4. Make sure all dependencies are installed:

```bash
npm install
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Database Management

- `npx prisma studio` - Open Prisma Studio (visual database browser) at [http://localhost:5555](http://localhost:5555)
- `npx prisma generate` - Generate Prisma Client after schema changes
- `npx prisma db push` - Push schema changes to database
- `npx prisma migrate dev` - Create and apply migrations
