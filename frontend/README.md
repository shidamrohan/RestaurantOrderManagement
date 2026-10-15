# Restaurant Order Management - Frontend

Modern, responsive Next.js + React + TypeScript web application for online food ordering and operations dashboard.

## Architecture

- **`src/app/`**: Next.js App Router (pages, layouts, auth routes, admin panels).
- **`src/components/`**: Modular UI components (FoodCard, CartDrawer, OrderTimeline, Navbar, etc.).
- **`src/context/`**: State management for user authentication and active cart.
- **`src/services/`**: API client methods interfacing with the Express backend.
- **`src/types/`**: TypeScript type definitions.

## Setup & Running

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.
