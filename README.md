# Jupiterax - Digital Marketplace Platform

A professional, production-ready e-commerce platform for selling digital products, built with Next.js 16, featuring comprehensive admin controls, secure payments, and a complete customer support system.

## ✨ Features

### 🛍️ E-Commerce Core
- **Product Catalog**: Browse products with advanced search and category filtering
- **Shopping Cart**: Persistent cart with real-time updates and checkout flow
- **Payments**: Stripe integration with secure checkout and webhook handling
- **Downloads**: Secure digital product delivery for purchased items
- **Featured Products**: Admin-controlled featured products showcase
- **Store Page**: Unified store view displaying all available products

### 👤 User Experience
- **Authentication**: Clerk-powered auth with social login support
- **User Dashboard**: Personal profile, purchase history, and order tracking
- **Product Details**: Comprehensive product pages with images and descriptions
- **Order Management**: View order status, history, and download purchased files
- **Responsive Design**: Mobile-first design that works on all devices

### 🎫 Customer Support System
- **Ticket Management**: Submit and track support tickets
- **Live Chat**: Real-time messaging between customers and admin
- **Status Tracking**: Track ticket progress (Open, In Progress, Resolved, Closed)
- **Priority Levels**: Organize tickets by priority (Low, Medium, High)
- **Conversation History**: Full chat history for logged-in users
- **Contact Page**: Professional contact form with ticket integration

### 🔐 Admin Dashboard
- **User Management**: View all users, promote/demote admin roles, track activity
- **Category Management**: Create, edit, delete categories with icons and status control
- **Product Management**: Full CRUD operations, feature toggles, inventory control
- **Order Oversight**: View all orders, order details, and customer information
- **Payment Analytics**: Revenue tracking, payment statistics, and financial insights
- **Ticket Management**: Handle customer support with chat interface and status updates
- **Site Settings**: Edit hero section, about page, social links, and site configuration
- **Role-Based Access**: Protected admin routes with middleware authentication

### 🎨 Design & Polish
- **Modern UI**: Clean, professional interface with Radix UI components
- **Dark Mode**: Elegant dark theme throughout the application
- **Animations**: Smooth transitions and interactions with Framer Motion
- **Responsive**: Fully responsive design for desktop, tablet, and mobile
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: User-friendly error messages and fallback UI

## 🛠️ Tech Stack

### Core Framework
- **Next.js 16.0.1**: React framework with App Router, Server Components, and API routes
- **React 19**: Latest React with concurrent features

### Authentication & Security
- **Clerk ^6.35.0**: Complete authentication with social login and role management
- **Middleware Protection**: Route protection for admin and user areas
- **Rate Limiting**: API rate limiting utilities (configurable)

### Database & ORM
- **PostgreSQL**: Production-grade relational database (Neon recommended)
- **Drizzle ORM**: Type-safe database toolkit with migrations
- **9 Database Tables**: Users, products, categories, orders, payments, tickets, messages, settings, cart

### Payments & Storage
- **Stripe ^19.3.1**: Payment processing with webhooks for order fulfillment
- **Firebase Storage**: Secure file storage for product images and digital files

### UI & Styling
- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Accessible, unstyled component primitives
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful, consistent icon set

### State Management & Data Fetching
- **React Context API**: Global state (CartContext, user state)
- **Custom Hooks**: useFetch, useLocalStorage, useDebounce
- **Axios**: HTTP client for API requests

### Developer Experience
- **ESLint**: Code linting with Next.js config
- **JSDoc**: Type annotations for better IntelliSense
- **Professional Structure**: Organized folders (lib/api/, lib/validations/, hooks/, types/)

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following:

- **Node.js 18+**: [Download here](https://nodejs.org/)
- **PostgreSQL Database**: [Neon](https://neon.tech/) (recommended) or any PostgreSQL provider
- **Firebase Project**: [Create here](https://console.firebase.google.com/)
- **Stripe Account**: [Sign up here](https://stripe.com/)
- **Clerk Account**: [Sign up here](https://clerk.com/)

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/Kandan03/e-com.git
cd e-com
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Copy the example environment file and fill in your credentials:
```bash
copy .env.example .env.local
```

See the [Environment Variables](#environment-variables) section below for all required variables.

4. **Initialize the database**
```bash
npm run db:push
```

This creates all necessary tables in your PostgreSQL database.

5. **Start the development server**
```bash
npm run dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

7. **Set up first admin user**

After signing up through the website, promote your account to admin:
```sql
UPDATE users SET is_admin = true WHERE email = 'your@email.com';
```

### Environment Variables

Create a `.env.local` file with these variables. See `.env.example` for a complete template.

#### Clerk Authentication
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

#### Database (Neon PostgreSQL)
```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

#### Firebase Storage
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456:web:xxxxx
```

#### Stripe Payments
```env
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

#### Base URL
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

For production, update this to your deployed domain (e.g., `https://yourdomain.com`).

## 📁 Project Structure

```
e-com/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/              # Auth pages (sign-in, sign-up)
│   │   ├── (route)/             # Protected user routes
│   │   │   ├── dashboard/       # User dashboard & add-product
│   │   │   ├── store/           # All products page & product details
│   │   │   ├── contact/         # Contact form & ticket system
│   │   │   ├── cart/            # Shopping cart
│   │   │   └── checkout/        # Checkout & success pages
│   │   ├── admin/               # Admin dashboard (protected)
│   │   │   ├── users/           # User management
│   │   │   ├── categories/      # Category CRUD
│   │   │   ├── products/        # Product management
│   │   │   ├── orders/          # Order management
│   │   │   ├── payments/        # Payment analytics
│   │   │   ├── tickets/         # Ticket system with chat
│   │   │   └── settings/        # Site settings (hero, about, etc.)
│   │   ├── api/                 # API routes
│   │   │   ├── products/        # Product CRUD endpoints
│   │   │   ├── categories/      # Category endpoints
│   │   │   ├── tickets/         # Ticket endpoints
│   │   │   ├── orders/          # Order endpoints
│   │   │   ├── settings/        # Settings endpoints
│   │   │   ├── user/            # User profile endpoints
│   │   │   └── webhook/         # Stripe webhook handler
│   │   ├── _components/         # Shared components
│   │   ├── globals.css          # Global styles
│   │   ├── layout.js            # Root layout
│   │   └── provider.js          # Context providers
│   │
│   ├── components/              # Reusable UI components
│   │   └── ui/                  # Radix UI components
│   │
│   ├── contexts/                # React Context providers
│   │   └── CartContext.jsx      # Shopping cart state
│   │
│   ├── lib/                     # Utilities and helpers
│   │   ├── api/                 # API utilities
│   │   │   ├── adminAuth.js     # Admin authentication
│   │   │   └── response.js      # API response helpers
│   │   └── utils.js             # General utilities
│   │
│   └── middleware.js            # Clerk auth middleware
│
├── configs/                     # Configuration files
│   ├── db.js                    # Database connection (Drizzle)
│   ├── schema.js                # Database schema
│   └── firebase.js              # Firebase initialization
│
├── drizzle/                     # Database migrations
│   └── meta/                    # Migration metadata
│
├── public/                      # Static assets
│
├── .env.example                 # Environment variables template
├── .env.local                   # Your local environment (gitignored)
├── .gitignore                   # Git ignore rules
├── components.json              # shadcn/ui config
├── drizzle.config.js            # Drizzle ORM config
├── eslint.config.mjs            # ESLint configuration
├── jsconfig.json                # JavaScript config
├── middleware.js                # Clerk auth middleware
├── next.config.mjs              # Next.js configuration
├── package.json                 # Dependencies
├── postcss.config.mjs           # PostCSS config
├── tailwind.config.js           # Tailwind CSS config
├── CHECKLIST.md                 # Project completion checklist
├── CONTRIBUTING.md              # Contribution guidelines
├── DEPLOYMENT.md                # Deployment guide
├── STRUCTURE.md                 # File structure details
└── README.md                    # This file
```

### Key Directories

- **`src/app/`**: Next.js App Router with pages and API routes
- **`src/lib/api/`**: API utilities (authentication and response helpers)
- **`src/contexts/`**: React Context for global state management
- **`configs/`**: Database and Firebase configuration
- **`drizzle/`**: Database migrations and snapshots

For detailed file structure explanations, see [STRUCTURE.md](./STRUCTURE.md).

## 🔑 Key Features Details

### Admin Dashboard
- **Access**: Navigate to `/admin` (requires admin role)
- **User Promotion**: First user must be promoted via database query
- **Full Control**: Complete CRUD operations on all resources
- **Analytics**: Real-time statistics and revenue tracking
- **Support System**: Chat-based customer support with ticket management

### Customer Experience
- **Product Discovery**: Browse by category, search products, view featured items
- **Shopping**: Add to cart, secure checkout with Stripe
- **Account**: View purchase history, download digital files
- **Support**: Submit tickets, chat with admin, track ticket status
- **Profile**: Manage account settings and preferences

### Database Schema
The application uses 9 tables:
- **users**: User accounts with admin roles
- **categories**: Product categories with icons and status
- **products**: Digital products with files and metadata
- **orders**: Purchase orders with status tracking
- **payments**: Payment records linked to Stripe
- **cart**: Shopping cart items
- **tickets**: Support tickets with status and priority
- **ticket_messages**: Chat messages for tickets
- **site_settings**: Configurable site content (hero, about, social)

### Security Features
- **Route Protection**: Clerk middleware guards all protected routes
- **Admin Authorization**: Admin-only endpoints verify user roles
- **Secure Downloads**: Files only accessible to purchasers
- **Environment Validation**: Required environment variables checked at startup
- **Rate Limiting**: API rate limiting utilities available (see `src/lib/api/rateLimiter.js`)
- **CORS Configuration**: Proper CORS headers for API security
- **Webhook Verification**: Stripe webhook signature validation

## 📡 API Routes

### Public Endpoints
These endpoints are accessible without authentication:

- `GET /api/products` - List all products with pagination
- `GET /api/products?featured=true` - Get featured products
- `GET /api/products?category=<id>` - Filter by category
- `GET /api/categories` - List active categories
- `GET /api/settings` - Get site settings (hero, about, social links)

### User Endpoints
Requires user authentication:

- `POST /api/tickets` - Create a new support ticket
- `GET /api/tickets` - Get user's tickets
- `POST /api/tickets/messages` - Send a message in a ticket
- `GET /api/user` - Get current user profile
- `POST /api/products` - Create product (user-submitted)
- `PUT /api/products` - Update own product
- `DELETE /api/products` - Delete own product

### Admin Endpoints
Requires admin role:

- `GET /api/admin/users` - List all users
- `PUT /api/admin/users` - Update user roles
- `GET /api/admin/tickets` - List all tickets
- `PUT /api/admin/tickets` - Update ticket status
- `GET /api/admin/orders` - View all orders
- `GET /api/admin/payments` - View payment analytics
- `POST /api/admin/settings` - Update site settings
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories` - Update category
- `DELETE /api/admin/categories` - Delete category

### Webhooks
- `POST /api/webhook` - Stripe webhook handler for payment events

### API Response Format
All API responses follow a consistent format:
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message"
}
```

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build production bundle
npm run start        # Start production server
npm run lint         # Run ESLint to check code quality

# Database
npm run db:push      # Push schema changes to database (no migration files)
npm run db:generate  # Generate migration files from schema changes
npm run db:migrate   # Apply generated migrations to database

# Utilities
npm run format       # Format code with Prettier (if configured)
npm run type-check   # Check JSDoc types (if configured)
```

### Database Management

**Quick schema push** (for development):
```bash
npm run db:push
```
This directly syncs your schema to the database without creating migration files.

**Generate migrations** (for production):
```bash
npm run db:generate
npm run db:migrate
```
This creates migration files and applies them, preserving data safely.

### Stripe Webhook Testing

To test Stripe webhooks locally:
```bash
stripe listen --forward-to localhost:3000/api/webhook
```
This will give you a webhook signing secret to use in `.env.local`.

## 🚀 Deployment

This project is production-ready and can be deployed to various platforms:

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables
4. Deploy automatically

### Other Platforms
- **Netlify**: Supports Next.js with edge functions
- **Railway**: Full-stack deployment with database
- **AWS/GCP/Azure**: Deploy using Docker or serverless

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Post-Deployment Checklist
- [ ] Configure Stripe webhook URL in Stripe Dashboard
- [ ] Update `NEXT_PUBLIC_BASE_URL` to production domain
- [ ] Promote first user to admin via database query
- [ ] Test all payment flows
- [ ] Verify file uploads to Firebase
- [ ] Test email notifications (if configured)
- [ ] Set up monitoring and error tracking

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Contribution Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

For detailed contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## 📚 Documentation

- **[STRUCTURE.md](./STRUCTURE.md)**: Detailed file structure and organization
- **[DEPLOYMENT.md](./DEPLOYMENT.md)**: Comprehensive deployment guide
- **[CONTRIBUTING.md](./CONTRIBUTING.md)**: Contribution guidelines and workflow
- **[CHECKLIST.md](./CHECKLIST.md)**: Project completion verification

## 🐛 Troubleshooting

### Common Issues

**Database connection fails:**
- Verify `DATABASE_URL` in `.env.local`
- Ensure database is accessible from your network
- Check if SSL mode is required for your provider

**Stripe webhook not working:**
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Use `stripe listen` for local testing
- Check webhook URL in Stripe Dashboard for production

**Firebase upload fails:**
- Verify all Firebase credentials are correct
- Check Firebase Storage rules allow uploads
- Ensure storage bucket exists

**Admin panel not accessible:**
- Verify user has `is_admin = true` in database
- Clear browser cache and cookies
- Check middleware.js for route protection

For more help, see the documentation files or create an issue.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/Kandan03/e-com/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Kandan03/e-com/discussions)
- **Email**: support@jupiterax.com (if configured)

## 🙏 Acknowledgments

Built with these amazing technologies:
- [Next.js](https://nextjs.org/) - The React Framework
- [Clerk](https://clerk.com/) - Authentication & User Management
- [Stripe](https://stripe.com/) - Payment Processing
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-First CSS
- [Radix UI](https://www.radix-ui.com/) - Accessible Components
- [Framer Motion](https://www.framer.com/motion/) - Animation Library

## ⭐ Star History

If you find this project helpful, please consider giving it a star on GitHub!

---

**Built with ❤️ by [Kandan03](https://github.com/Kandan03)**

*A production-ready digital marketplace platform for the modern web.*

