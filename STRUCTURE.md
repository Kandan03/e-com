# Project Structure

## Overview
This document describes the recommended file structure for the Jupiterax e-commerce platform.

## Directory Structure

```
e-com/
├── configs/                      # Configuration files
│   ├── db.js                     # Database connection
│   ├── schema.js                 # Drizzle ORM schema
│   └── firebase.js               # Firebase configuration
│
├── drizzle/                      # Database migrations
│   ├── meta/                     # Migration metadata
│   └── *.sql                     # SQL migration files
│
├── public/                       # Static assets
│   ├── noise.png                 # Background textures
│   └── ...                       # Other static files
│
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Authentication routes (grouped)
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   │
│   │   ├── (route)/              # Main application routes (grouped)
│   │   │   ├── dashboard/        # User dashboard
│   │   │   │   ├── page.jsx
│   │   │   │   ├── add-product/
│   │   │   │   ├── edit-product/
│   │   │   │   └── _components/
│   │   │   ├── explore/          # Product browsing
│   │   │   ├── store/            # All products page
│   │   │   ├── contact/          # Contact/Support tickets
│   │   │   ├── cart/             # Shopping cart
│   │   │   ├── success/          # Payment success
│   │   │   └── layout.jsx
│   │   │
│   │   ├── admin/                # Admin dashboard
│   │   │   ├── page.jsx          # Dashboard overview
│   │   │   ├── layout.jsx        # Admin layout with sidebar
│   │   │   ├── users/            # User management
│   │   │   ├── categories/       # Category management
│   │   │   ├── products/         # Product management
│   │   │   ├── orders/           # Order management
│   │   │   ├── payments/         # Payment analytics
│   │   │   ├── tickets/          # Support ticket management
│   │   │   └── settings/         # Site settings
│   │   │
│   │   ├── api/                  # API routes
│   │   │   ├── products/         # Product CRUD
│   │   │   │   ├── route.jsx
│   │   │   │   └── featured/
│   │   │   ├── tickets/          # Ticket system
│   │   │   │   ├── route.jsx
│   │   │   │   └── messages/
│   │   │   ├── categories/       # Category endpoints
│   │   │   ├── user/             # User operations
│   │   │   ├── cart/             # Cart operations
│   │   │   ├── orders/           # Order operations
│   │   │   ├── settings/         # Public settings
│   │   │   ├── webhook/          # Stripe webhooks
│   │   │   └── admin/            # Admin-only endpoints
│   │   │       ├── users/
│   │   │       ├── categories/
│   │   │       ├── tickets/
│   │   │       ├── payments/
│   │   │       └── settings/
│   │   │
│   │   ├── _components/          # Shared app components
│   │   │   ├── Header.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── About.jsx
│   │   │   ├── ProductsList.jsx
│   │   │   └── ProductCardItem.jsx
│   │   │
│   │   ├── globals.css           # Global styles
│   │   ├── layout.js             # Root layout
│   │   ├── page.js               # Homepage
│   │   ├── provider.js           # Context providers
│   │   └── not-found.jsx         # 404 page
│   │
│   ├── components/               # Reusable UI components
│   │   ├── ui/                   # Base UI components (Radix UI)
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── input.jsx
│   │   │   ├── textarea.jsx
│   │   │   ├── select.jsx
│   │   │   ├── tabs.jsx
│   │   │   ├── skeleton.jsx
│   │   │   ├── popover.jsx
│   │   │   └── sonner.jsx
│   │   │
│   │   ├── shared/               # Shared feature components
│   │   ├── ErrorBoundary.jsx     # Global error boundary
│   │   └── Loading.jsx           # Loading components
│   │
│   ├── contexts/                 # React contexts
│   │   └── CartContext.jsx       # Shopping cart state
│   │
│   ├── lib/                      # Utility libraries
│   │   ├── api/                  # API-related utilities
│   │   │   ├── adminAuth.js      # Admin authentication
│   │   │   └── response.js       # API response helpers
│   │   │
│   │   └── utils.js              # General utilities
│   │
│   └── middleware.js             # Clerk authentication middleware
│
│   │   ├── utils.js              # General utilities (merged from utils.js)
│   │   ├── helpers.js            # Helper functions
│   │   ├── constants.js          # App constants
│   │   ├── config.js             # App configuration
│   │   └── env.js                # Environment validation
│   │
│   └── types/                    # Type definitions (JSDoc)
│       └── index.js              # Type definitions
│
├── .env.local                    # Environment variables (gitignored)
├── .gitignore                    # Git ignore rules
├── components.json               # Shadcn/ui configuration
├── drizzle.config.js             # Drizzle ORM config
├── eslint.config.mjs             # ESLint configuration
├── jsconfig.json                 # JavaScript config
├── middleware.js                 # Next.js middleware (Clerk)
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies
├── postcss.config.mjs            # PostCSS configuration
├── README.md                     # Project documentation
└── tailwind.config.js            # Tailwind CSS configuration
```

## Key Principles

### 1. Separation of Concerns
- **app/**: Contains all routes and page components
- **components/**: Reusable UI components
- **lib/**: Business logic and utilities
- **contexts/**: Global state management

### 2. Colocation
- Components specific to a route are in `_components` folders
- Keeps related code together for easier maintenance

### 3. API Structure
- Public APIs in `/api/*`
- Admin APIs in `/api/admin/*`
- Clear separation of concerns

### 4. Scalability
- Organized by feature/domain
- Easy to add new features
- Minimal dependencies

## Import Paths

Use absolute imports with `@/` prefix:

```javascript
// Components
import { Button } from "@/components/ui/button";
import Header from "@/app/_components/Header";

// Utilities
import { cn } from "@/lib/utils";
import { checkAdminAuth } from "@/lib/api/adminAuth";

// Contexts
import { useCart } from "@/contexts/CartContext";
```

## Best Practices

1. **Keep components small and focused**
   - Single responsibility principle
   - Extract reusable logic

2. **Follow naming conventions**
   - PascalCase for components: `ProductCard.jsx`
   - camelCase for utilities: `formatCurrency.js`
   - kebab-case for routes: `/product-details`

3. **Organize by feature, not by type**
   - Group related files together
   - Makes it easier to find and modify features

5. **Use barrel exports**
   - Simplifies imports
   - Provides a clear public API

## Migration Notes

Recent structural improvements:
- ✅ Moved API utilities to `lib/api/`
- ✅ Created `hooks/` folder for custom hooks
- ✅ Added `validations/` for validation logic
- ✅ Created `types/` for type definitions
- ✅ Organized constants and config
- ✅ Added comprehensive documentation

## Future Improvements

Consider these as the project grows:
- Add `services/` folder for complex business logic
- Create `layouts/` folder for reusable layouts
- Add `tests/` folder for unit and integration tests
- Consider `features/` folder for domain-driven design
