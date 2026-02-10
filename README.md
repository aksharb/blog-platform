This is a minimal blogging platform built using the following core technologies:

Next.js 15 (App Router): Utilized for server-side rendering (SSR), file-based routing, and efficient data fetching through Server Components.

PostgreSQL & Prisma ORM: PostgreSQL serves as the relational database, managed via Prisma for type-safe schema modeling and database migrations.

NextAuth.js: Handles secure user authentication, session management, and role-based access control for AUTHOR and ADMIN roles.

Tailwind CSS: Provides the styling for a high-contrast, dark-mode UI inspired by a "Digital Love/2016" aesthetic.

RESTful API Architecture: Backend operations for managing "signals" (posts), users, and comments are handled through dedicated API routes.

The platform is designed to meet the requirements of a multi-user blog, featuring unique slug generation for SEO, a draft/published status system for post management, and an interactive authenticated comment system.

### Architecture

The platform is built as a full-stack application using the **Next.js 15 App Router**. It follows a modular structure:

- **Frontend**: React Server Components handle data fetching directly from the database to ensure fast initial loads and SEO-friendly pages.
- **Backend**: A RESTful API architecture manages data operations for posts, user authentication, and comments.
- **Database & ORM**: PostgreSQL is used for relational data storage, interfaced through Prisma ORM for type-safe queries and schema modeling.
- **Authentication**: NextAuth.js manages secure sessions and role-based access control for AUTHOR and ADMIN roles.

### Environment Variables

To run this project, create a `.env` file in the root directory with the following variables:

- **DATABASE_URL**: Your PostgreSQL connection string.
- **NEXTAUTH_SECRET**: A secure random string for session encryption.
- **NEXTAUTH_URL**: Set to `http://localhost:3000` for local development.

### Local Setup

1. **Installation**: Clone the repository and run `npm install` to load all dependencies.
2. **Database Sync**: Push the Prisma schema to your database instance using `npx prisma db push`.
3. **Development**: Launch the local server by running `npm run dev`.
4. **Access**: Open `http://localhost:3000` in your browser to view the application.

### Deployment Steps

The platform is optimized for deployment on **Vercel** (Frontend/API) and **Railway** or **Supabase** (PostgreSQL).

1. **Database**: Provision a PostgreSQL database and copy the connection string.
2. **Vercel Project**: Link your GitHub repository to Vercel.
3. **Configure Vars**: Add the Environment Variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`) in the Vercel project settings.
4. **Build**: Vercel will automatically run the build command and deploy your application.
