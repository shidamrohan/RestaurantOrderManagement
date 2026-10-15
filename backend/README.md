# Restaurant Order Management - Backend

Node.js & Express REST API powered by MongoDB Atlas and Express Sessions.

## Architecture

- **`src/config/`**: Database connection and session configuration.
- **`src/models/`**: Mongoose schemas for `User`, `Category`, `MenuItem`, and `Order`.
- **`src/controllers/`**: Route handlers encapsulating business logic.
- **`src/routes/`**: Express endpoints for auth, menu items, categories, and orders.
- **`src/middleware/`**: Authentication checks, role-based access control, error handling.
- **`src/utils/`**: Database seeding scripts and helper utilities.

## Setup & Running

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Configure your MongoDB Atlas connection string in `.env`.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run in development mode:
   ```bash
   npm run dev
   ```
