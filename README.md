# JA Hypothèques Dashboard

A Next.js dashboard application for JA Hypothèques with Material-UI and PostgreSQL database integration.

## Features

- 🎨 Material-UI components for a modern interface
- 🗄️ PostgreSQL database connection
- 📊 Dashboard with data visualization
- ⚡ Built with Next.js 15 and TypeScript
- 🚀 Ready for Vercel deployment

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Access to the PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jahypotheques/dashboard.git
cd dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the `DATABASE_URL` with your PostgreSQL credentials

```bash
cp .env.example .env
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment on Vercel

### Option 1: Deploy via GitHub

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variable `DATABASE_URL` in Vercel project settings
6. Deploy!

### Option 2: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel
```

**Important:** Make sure to add the `DATABASE_URL` environment variable in your Vercel project settings.

## Environment Variables

Create a `.env` file with the following variables:

```
DATABASE_URL='postgresql://user:password@host:port/database'
```

## Project Structure

```
jahypotheques-dashboard/
├── app/
│   ├── api/
│   │   └── data/
│   │       └── route.ts          # API endpoint for database queries
│   ├── layout.tsx                # Root layout with theme provider
│   ├── page.tsx                  # Main dashboard page
│   └── globals.css               # Global styles
├── components/
│   └── ThemeRegistry.tsx         # Material-UI theme configuration
├── lib/
│   └── db.ts                     # Database connection utility
├── theme/
│   └── theme.ts                  # Material-UI theme customization
├── .env                          # Environment variables (not committed)
├── .env.example                  # Example environment variables
└── package.json
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Material-UI** - React UI component library
- **PostgreSQL** - Database
- **Emotion** - CSS-in-JS styling
- **pg** - PostgreSQL client for Node.js

## Customization

### Modifying Database Queries

Edit the API route at `app/api/data/route.ts` to customize the data fetched from your database.

### Updating the Theme

Modify the theme configuration in `theme/theme.ts` to match your brand colors and styling preferences.

### Adding New Pages

Create new pages in the `app/` directory following Next.js App Router conventions.

## License

MIT
