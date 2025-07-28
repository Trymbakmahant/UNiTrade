# UniFi Trading Server

A backend server for the UniFi trading application built with Hono, Prisma, and PostgreSQL.

## Features

- 🔐 Wallet-based authentication
- 📊 Trading order management
- 👤 User profile management
- 💼 Portfolio tracking
- 📈 Trading history
- 🛡️ Rate limiting and security

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm (recommended) or npm

### Installation

1. **Install dependencies:**

   ```bash
   cd server
   pnpm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Set up the database:**

   ```bash
   pnpm db:generate
   pnpm db:push
   ```

4. **Start the development server:**
   ```bash
   pnpm dev
   ```

The server will be running on `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/dashboard` - Get dashboard data

### Trading

- `POST /api/trading/orders` - Create new order
- `GET /api/trading/orders` - Get user orders
- `DELETE /api/trading/orders/:id` - Cancel order

## Environment Variables

```env
DATABASE_URL="postgresql://username:password@localhost:5432/unifi_trading"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=3001
NODE_ENV=development
```

## Development

```bash
# Start development server with hot reload
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Database operations
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push schema to database
pnpm db:migrate   # Run migrations
pnpm db:studio    # Open Prisma Studio
```

## Project Structure

```
server/
├── src/
│   ├── controllers/     # Request handlers
│   ├── routes/         # API route definitions
│   ├── middleware/     # Custom middleware
│   ├── models/         # Data models (Prisma)
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript types
│   └── app.ts          # Main application
├── prisma/
│   └── schema.prisma   # Database schema
├── package.json
├── tsconfig.json
└── .env
```

## License

MIT
