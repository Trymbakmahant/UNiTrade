# UNIFI Trading Platform

A decentralized stop-loss trading platform with cross-chain bridging capabilities, built with Next.js frontend and Hono backend.

## Features

- 🔐 **Authentication System** - Secure user registration and login
- 📊 **Real-time Trading Dashboard** - Portfolio tracking and analytics
- 💱 **Trading Interface** - Place buy/sell orders with stop-loss protection
- 🌐 **Cross-chain Support** - Trade across multiple blockchain networks
- 📈 **Price Charts** - Real-time price data and technical analysis
- 🎯 **Order Management** - Track and manage your trading orders
- 🔒 **Web3 Integration** - Connect with popular wallets via Reown AppKit

## Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Reown AppKit** - Web3 wallet integration
- **Axios** - HTTP client for API communication
- **React Query** - Server state management

### Backend

- **Hono** - Fast web framework for TypeScript
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Zod** - Schema validation
- **OpenAPI** - API documentation

## Prerequisites

- Node.js 18+
- npm or pnpm
- PostgreSQL database

## Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd UNIFI
   ```

2. **Install dependencies**

   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   Create `.env` files in both `server/` and `client/` directories:

   **server/.env**

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/unifi_db"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=3001
   ```

   **client/.env.local**

   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3001"
   ```

4. **Set up the database**

   ```bash
   npm run db:setup
   ```

5. **Start the development servers**

   ```bash
   npm run dev
   ```

   This will start:

   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001
   - API Documentation: http://localhost:3001/docs

## Project Structure

```
UNIFI/
├── client/                 # Next.js frontend
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── context/          # React context providers
│   ├── lib/              # Utility functions and API
│   └── public/           # Static assets
├── server/               # Hono backend
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Custom middleware
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── types/        # TypeScript types
│   └── prisma/           # Database schema
└── package.json          # Root package.json for scripts
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Trading

- `POST /api/trading/orders` - Create new order
- `GET /api/trading/orders` - Get user orders
- `DELETE /api/trading/orders/:id` - Cancel order

### User Management

- `GET /api/users/me` - Get current user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/dashboard/stats` - Get dashboard statistics
- `GET /api/users/trades` - Get trade history
- `GET /api/users/portfolio` - Get portfolio holdings

## Development

### Running Individual Services

**Frontend only:**

```bash
npm run dev:client
```

**Backend only:**

```bash
npm run dev:server
```

### Database Management

**View database in Prisma Studio:**

```bash
npm run db:studio
```

**Generate Prisma client:**

```bash
cd server && npm run db:generate
```

**Push schema changes:**

```bash
cd server && npm run db:push
```

### Building for Production

```bash
npm run build
```

## Environment Variables

### Backend (.env)

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3001)

### Frontend (.env.local)

- `NEXT_PUBLIC_API_URL` - Backend API URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue on GitHub or contact the development team.
