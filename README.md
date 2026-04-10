# UNA-ET-HU Website

Official website for United Nations Association - Hawassa University Chapter.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **NextAuth** - Authentication (ready to configure)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Local Environment Setup

For local development, each teammate should keep their own env file on their machine.

1. Copy [.env.example](.env.example) to [.env.local](.env.local) or [.env](.env).
2. Fill in the values from your local or Supabase setup.
3. Do not commit the real env file.

Recommended team flow:

- Keep secrets out of git.
- Use [.env.example](.env.example) as the shared template.
- Use Vercel environment variables for production.
- Use [.env.local](.env.local) for your personal development machine.

### Installation

1. Install dependencies:

```bash
npm install
```

1. Set up environment variables:

```bash
cp .env.example .env
```

If you prefer the more common Next.js local override file, use:

```bash
cp .env.example .env.local
```

Either file works for local development because `.env*` files are ignored by git in this repo.

1. Configure your database connection.

   - Use [.env.example](.env.example) as the template.
   - For Supabase Postgres, set:
     - `DATABASE_URL` to the **connection pooling** URI
     - `DIRECT_URL` to the **direct connection** URI

1. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

1. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

If you plan to use admin uploads for announcements, gallery images, or magazine PDFs, also set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)

The upload flow uses a public Supabase Storage bucket named `uploads`.

### Team Workflow

For local development, each teammate should create their own `.env.local` file from `.env.example` and keep it uncommitted.

Recommended split:

- `.env.example`: committed template with variable names only
- `.env.local`: each developer's local secrets and local values
- Vercel environment variables: production values for deploys

This lets everyone run `npm run dev` locally while Vercel handles preview and production redeploys from git pushes.

## Project Structure

```text
website/
├── app/
│   ├── about/           # About page
│   ├── auth/            # Authentication pages
│   ├── blog/            # Blog feed and post pages
│   ├── components/      # Reusable components
│   ├── mun/             # Model UN portal
│   ├── teams/           # Team directory
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
├── lib/
│   └── prisma.ts        # Prisma client
├── prisma/
│   └── schema.prisma    # Database schema
└── public/              # Static assets
```

## Pages

- **/** - Landing page with hero, mission cards, and blog preview
- **/about** - About page with values and history timeline
- **/blog** - Blog feed with bento grid layout
- **/blog/[slug]** - Individual blog post with comments
- **/auth/signin** - Sign in page
- **/auth/signup** - Sign up page
- **/teams** - Team directory with filters
- **/mun** - Model UN portal with conferences
- **/admin** - Admin dashboard for blog management

## Database Schema

The Prisma schema includes models for:

- Users (with authentication)
- Blog Posts
- Comments
- Teams and Team Members
- Conferences (MUN events)
- Projects
- Gallery Images

## Next Steps

1. Configure NextAuth for authentication
2. Set up image upload for blog posts and gallery
3. Implement API routes for blog CRUD operations
4. Add admin authentication
5. Deploy to production

## License

All rights reserved © 2024 United Nations Association Ethiopia - HU Chapter
