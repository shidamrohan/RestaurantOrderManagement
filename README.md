# Restaurant Food Order Management System

A responsive, full-stack web application for restaurant food ordering, real-time order tracking, and restaurant operations management.

## 🚀 Tech Stack

- **Frontend**: Next.js, React, TypeScript, CSS / Tailwind Design System
- **Backend**: Node.js, Express.js, REST API
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: Session-based auth (`express-session` with `connect-mongo`)
- **Roles**: Customer, Restaurant Staff, Administrator

---

## 📁 Project Structure

```text
RestaurantOrderManagement/
├── .gitignore                     # Git ignore rules for node_modules, env, and build artifacts
├── README.md                      # Project documentation and roadmap
├── backend/                       # Node.js + Express REST API
│   ├── .env.example               # Backend environment variables template
│   ├── package.json               # Backend dependencies and scripts
│   ├── README.md                  # Backend documentation
│   └── src/
│       ├── server.js              # Express app entrypoint & middleware setup
│       ├── config/
│       │   └── db.js              # MongoDB Atlas connection handler
│       ├── controllers/           # Business logic & request handlers
│       ├── middleware/            # Auth, authorization, error handling
│       ├── models/                # Mongoose schemas (User, Category, MenuItem, Order)
│       ├── routes/                # REST API routes
│       └── utils/                 # Seeding scripts & utilities
└── frontend/                      # Next.js + React + TypeScript App
    ├── .env.example               # Frontend environment variables template
    ├── next.config.mjs            # Next.js configuration
    ├── package.json               # Frontend dependencies and scripts
    ├── tsconfig.json              # TypeScript compiler configuration
    ├── README.md                  # Frontend documentation
    ├── public/                    # Static assets
    └── src/
        ├── app/                   # App router pages & layouts
        ├── components/            # Reusable UI components
        ├── context/               # React Contexts (Auth, Cart)
        ├── services/              # API client methods
        └── types/                 # TypeScript type definitions
```

---

## 🗄️ Database Collections (MongoDB)

1. **`users`**: Name, email, hashed password, role (`customer`, `staff`, `admin`).
2. **`categories`**: Category name, description, slug, display order.
3. **`menuitems`**: Food name, description, price, category reference, image URL, availability.
4. **`orders`**: Customer reference, items list, subtotal, delivery fee, total, fulfillment type (`delivery` | `pickup`), payment method (`COD` | `Pay at Restaurant`), status (`Pending`, `Confirmed`, `Preparing`, `Ready`, `Out for Delivery`, `Delivered`, `Cancelled`).
5. **`sessions`**: Server-side user login sessions stored via `connect-mongo`.

---

## 🗺️ Development Roadmap

- [x] **Project Scaffolding**: Setup modular full-stack repository structure.
- [ ] **Phase 1: Database Setup**: Connect to MongoDB Atlas, configure schemas, indexes, and test connection.
- [ ] **Phase 2: Backend Core**: Express API routes, session auth middleware, admin seeding, error handling.
- [ ] **Phase 3: Frontend Foundation**: Next.js App Router, global design tokens, navigation layout, API services.
- [ ] **Phase 4: Customer Ordering Flow**: Menu browsing, filtering, Cart context, checkout with COD / Pay at Restaurant, order history.
- [ ] **Phase 5: Staff & Admin Operations**: Order status transition dashboard, menu/category CRUD management.
- [ ] **Phase 6: Verification & Polish**: Security checks, edge case testing, responsive design QA.
- [ ] **Phase 7: Deployment Ready**: Production build validation and deployment configs.
