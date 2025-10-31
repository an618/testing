# GlidingPath Web

A modern retirement plan management platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Client-only Architecture**: Built for compatibility with Cursor AI and static deployment
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Type Safety**: Full TypeScript support with strict configuration
- **Authentication**: NextAuth.js integration for secure user management
- **Internationalization**: Multi-language support with next-intl
- **Role-based Access**: Protected routes for admin, employer, and employee roles
- **Retirement Planning**: Comprehensive 401(k) plan management tools

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: NextAuth.js
- **Internationalization**: next-intl
- **Charts**: Recharts
- **Icons**: React Icons
- **Payroll Integration**: Finch API

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/glidingpath-web.git
cd glidingpath-web
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
glidingpath-web/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard routes
│   ├── api/               # API routes
│   ├── dashboard/         # Main dashboard
│   ├── employee/          # Employee routes
│   ├── employer/          # Employer routes
│   ├── get-started/       # Plan setup flow
│   ├── login/             # Authentication
│   ├── register/          # Registration flow
│   └── providers/         # Client providers
├── components/            # Reusable UI components
│   └── ui/               # Base UI components
├── hooks/                # Custom React hooks
├── services/             # API service layer
├── types/                # TypeScript type definitions
├── utils/                # Utility functions and constants
├── messages/             # Internationalization files
└── i18n/                 # i18n configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# API Configuration
NEXT_PUBLIC_API_URL=https://api.glidingpath.com

# Finch API (Payroll Integration)
FINCH_CLIENT_ID=your-finch-client-id
FINCH_CLIENT_SECRET=your-finch-client-secret
```

## Architecture Decisions

### Client-Only Approach
This project is designed to be client-only for maximum compatibility with Cursor AI and static deployment platforms. All data fetching happens on the client side using React hooks and external APIs.

### Component Organization
- **UI Components**: Reusable base components in `components/ui/`
- **Feature Components**: Domain-specific components in `components/`
- **Page Components**: Route-specific components in `app/`

### State Management
- **Local State**: React useState and useContext for component state
- **Form State**: Controlled components with local state
- **Global State**: React Context for app-wide state when needed

### API Integration
- **Service Layer**: Centralized API calls in `services/`
- **Custom Hooks**: Data fetching logic in `hooks/`
- **Error Handling**: Consistent error handling across all API calls

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Code Style

- **TypeScript**: Strict mode enabled, prefer interfaces over types
- **Components**: Functional components with hooks
- **Naming**: PascalCase for components, camelCase for variables
- **Imports**: Named exports preferred over default exports
- **Comments**: Explain why, not what

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
