# **JTOtheLabel** - Full-Stack E-Commerce Platform

A modern, full-featured e-commerce platform built with **Next.js 14**, **MongoDB**, and **Tailwind CSS**. Features complete shopping cart, secure authentication, admin dashboard, and payment integration.

---

## **Features**

### Shopping Experience
- Product catalog with categories, search, and filtering
- Product detail pages with image galleries, variants (size/color), and inventory tracking
- Shopping cart with persistent storage (Zustand + localStorage)
- Smooth checkout process with delivery zone calculations
- Coupon/discount code support
- Order confirmation with tracking
- Favorites/Wishlist functionality
- Product reviews and ratings

### User Management
- JWT-based authentication with secure HTTP-only cookies
- Registration/login with bcrypt password hashing
- User profile and order history
- Account management panel

### Admin Dashboard
- **Administrator-only area** with role-based access control
- Full product management (CRUD operations)
- Order management with status tracking
- Customer/user management with ban capabilities
- Coupon management system
- Delivery zone configuration
- Analytics dashboard with revenue and metrics
- Real-time order status updates

### Technical Features
- **Demo Mode**: Toggle between demo data and live database
- **Middleware Protection**: Route-level authentication & authorization
- **Rate Limiting**: Protection against brute force attacks
- **Edge-compatible JWT**: Uses `jose` for middleware verification
- **Cloudinary Integration**: Image/video upload and optimization
- **Paystack Payment**: Secure payment processing
- **Email Integration**: Brevo (formerly SendInBlue) for transactional emails
- **Responsive Design**: Mobile-first Tailwind CSS styling
- **TypeScript Support**: Full type safety across the application

---

## **Tech Stack**

| Category | Technology |
|---------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Runtime** | Node.js |
| **Database** | MongoDB + Mongoose ODM |
| **Authentication** | JWT (jsonwebtoken + jose) + bcrypt |
| **State Management** | Zustand |
| **Styling** | Tailwind CSS + PostCSS |
| **Icons** | Lucide React |
| **Payment** | Paystack API |
| **Media** | Cloudinary |
| **Email** | Brevo API |
| **Validation** | validator.js |
| **Linting** | ESLint |

---

## **Project Structure**

```
e-commerce/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── (auth)/               # Authentication pages (grouped route)
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── account/              # User account pages
│   │   │   ├── orders/
│   │   │   └── page.js
│   │   ├── admin/                # Admin dashboard (protected)
│   │   │   ├── coupons/
│   │   │   ├── orders/           # Order management
│   │   │   │   └── [id]/        # Order detail view
│   │   │   ├── products/         # Product management
│   │   │   │   ├── new/
│   │   │   │   └── [id]/
│   │   │   ├── users/
│   │   │   ├── layout.js
│   │   │   └── page.js
│   │   ├── api/                  # API routes (28 endpoints)
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── cart/
│   │   │   ├── categories/
│   │   │   ├── coupons/
│   │   │   ├── delivery-zones/
│   │   │   ├── favourites/
│   │   │   ├── orders/
│   │   │   ├── payment/
│   │   │   ├── products/
│   │   │   ├── reviews/
│   │   │   ├── upload/
│   │   │   ├── users/
│   │   │   └── webhooks/
│   │   ├── cart/page.js
│   │   ├── checkout/page.js
│   │   ├── order-confirmation/[id]/
│   │   ├── products/             # Product catalog
│   │   │   ├── [slug]/
│   │   │   └── page.js
│   │   ├── search/page.js
│   │   ├── layout.js
│   │   └── page.js               # Homepage
│   ├── components/               # Reusable UI components
│   │   ├── admin/               # Admin-specific components
│   │   ├── cart/                # Cart drawer component
│   │   ├── checkout/            # Checkout form
│   │   ├── layout/              # Navbar, footer
│   │   ├── orders/              # Order status tracker
│   │   ├── products/            # Product cards, carousel, actions
│   │   └── ui/                  # Basic UI components (Button, Input, Modal, Badge)
│   ├── lib/                     # Utilities & configurations
│   │   ├── auth.js              # Authentication helpers
│   │   ├── brevo.js             # Email service
│   │   ├── cloudinary.js        # Media upload config
│   │   ├── demo-data.js         # Demo products & categories
│   │   ├── mongodb.js           # Database connection handler
│   │   ├── paystack.js          # Payment integration
│   │   ├── rate-limit.js        # Rate limiting utility
│   │   └── utils.js             # General utilities
│   ├── middleware.js            # Next.js middleware (auth, role checks)
│   ├── models/                  # Mongoose schemas
│   │   ├── User.js              # User schema with role & status
│   │   ├── Product.js           # Product with variants, inventory, media
│   │   ├── Order.js             # Order with delivery, payment, tracking
│   │   ├── Category.js          # Product categories
│   │   ├── Review.js            # Product reviews
│   │   ├── Coupon.js            # Discount codes
│   │   ├── DeliveryZone.js      # Shipping zones & fees
│   │   └── AbandonedCart.js     # Cart recovery analytics
│   └── store/                   # Zustand stores
│       ├── authStore.js         # Authentication state
│       └── cartStore.js         # Shopping cart state (persisted)
├── public/                      # Static assets (images, icons, etc.)
├── .env.local                   # Environment variables (create from .env.example)
├── tailwind.config.js           # Tailwind CSS configuration
├── next.config.mjs              # Next.js configuration
├── jsconfig.json                # Path aliases (@/* → src/*)
├── postcss.config.mjs           # PostCSS configuration
├── package.json                 # Dependencies & scripts
├── DEPENDENCIES.md              # Detailed dependency documentation
└── README.md                    # This file
```

---

## **Getting Started**

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **MongoDB** (local instance or Atlas connection string)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository** (or download the project)
   ```bash
   git clone <repository-url>
   cd e-commerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.local` and update with your values:
   ```bash
   cp .env.local .env.local
   ```

   Required variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ecommerce_demo
   JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
   PAYSTACK_SECRET_KEY=your_paystack_secret_key
   DEMO_MODE=true                    # Set to false for production
   ```

   Optional integrations:
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - for image uploads
   - `BREVO_API_KEY` - for transactional emails
   - `NODE_ENV=production` - for production deployments

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## **Demo Mode**

The application includes a **Demo Mode** that allows you to explore all features without connecting to a database.

### Enable Demo Mode

Set `DEMO_MODE=true` in your `.env.local` file. In demo mode:
- Pre-loaded sample products are displayed
- No database connection required
- **Admin routes are still protected** - use demo admin credentials:
  - Email: `admin@demo.com`
  - Password: `admin123`

### Disable for Production

Set `DEMO_MODE=false` and configure a valid `MONGODB_URI` connection string.

---

## **API Documentation**

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login` | User login (sets HTTP-only cookie) |
| `POST` | `/api/auth/logout` | Clear auth cookie |
| `GET`  | `/api/auth/me` | Get current user |
| `GET`  | `/api/auth/status` | Check user status (banned/active) |

### Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/products` | List all products (with optional category filter) |
| `GET`  | `/api/products/[id]` | Get single product |
| `POST` | `/api/products` | Create product (admin only) |
| `PUT`  | `/api/products/[id]` | Update product (admin only) |
| `DELETE` | `/api/products/[id]` | Delete product (admin only) |
| `GET`  | `/api/products/search?q=query` | Search products |

### Category Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/categories` | List all categories |
| `POST` | `/api/categories` | Create category (admin only) |

### Cart Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/cart/validate` | Validate cart items & calculate totals |
| `POST` | `/api/cart/abandon` | Track abandoned cart (analytics) |

### Order Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/orders` | List user's orders (or all for admin) |
| `GET`  | `/api/orders/[id]` | Get order details |
| `POST` | `/api/orders` | Create new order |
| `PATCH`| `/api/orders/[id]/status` | Update order status (admin only) |

### Payment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/payment/initialise` | Initialize Paystack payment |
| `POST` | `/api/payment/verify` | Verify payment transaction |
| `POST` | `/api/webhooks/paystack` | Paystack webhook handler |

### Coupon Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/coupons` | List all coupons (admin) |
| `POST` | `/api/coupons` | Create coupon (admin) |
| `POST` | `/api/coupons/validate` | Validate coupon code |

### Delivery Zone Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/delivery-zones` | List delivery zones (admin) |
| `POST` | `/api/delivery-zones` | Create zone (admin) |
| `PUT`  | `/api/delivery-zones/[id]` | Update zone (admin) |

### User Management (Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/users` | List all users (admin only) |
| `PATCH`| `/api/users/[id]/status` | Ban/unban user (admin only) |

### Upload Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload` | Upload media to Cloudinary (admin) |
| `DELETE`| `/api/upload/delete` | Delete media from Cloudinary (admin) |

### Admin Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/admin/analytics` | Dashboard metrics (admin only) |

### Favorites Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/favourites` | Get user's wishlist |
| `POST` | `/api/favourites` | Add/remove product from wishlist |

### Review Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/reviews/[productId]` | Get product reviews |
| `POST` | `/api/reviews/[productId]` | Submit review (authenticated) |

---

## **Authentication & Authorization**

The platform uses a robust security model:

### JWT Tokens
- Signed with `jsonwebtoken` (Node.js) and `jose` (Edge runtime)
- 7-day expiration
- Stored in HTTP-only, Secure cookies (SameSite=Strict)

### Middleware Protection
- Public routes: Home, Products, Product Detail, Search
- Protected routes: `/account/*`, `/admin/*`, all `POST/PUT/PATCH/DELETE` API routes
- Middleware validates JWT and checks user role/admin status
- Banned users are automatically logged out

### Role-Based Access
- **User role**: Can browse products, add to cart, checkout, manage account
- **Admin role**: Full access to admin dashboard and all management APIs

---

## **Database Schema**

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'admin',
  status: 'active' | 'banned',
  favourites: [Product],  // Array of product ObjectIds
  timestamps: true
}
```

### Product Model
```javascript
{
  name: String,
  slug: String (unique),
  description: String,
  price: Number,
  comparePrice: Number (optional),
  priceUSD: Number,
  currency: 'NGN' | 'USD',
  category: ObjectId (ref: Category),
  tags: [String],
  media: [              // Images/videos with Cloudinary support
    { type: 'image' | 'video', url: String, publicId: String, order: Number }
  ],
  variants: {
    sizes: [String],    // e.g., ['S', 'M', 'L', 'XL']
    colors: [{ name: String, hex: String }]  // Optional
  },
  inventory: Map,       // Key: "size-color" (e.g., "M-Red"), Value: quantity
  ratings: { average: Number, count: Number },
  status: 'active' | 'draft' | 'archived',
  featured: Boolean,
  salesCount: Number,
  timestamps: true
}
```

### Order Model
```javascript
{
  orderNumber: String (unique),
  user: ObjectId (ref: User, optional for guest checkout),
  userEmail: String,
  items: [
    {
      product: ObjectId,
      productName: String,
      image: String,
      variant: { size: String, color: String },
      quantity: Number,
      price: Number
    }
  ],
  delivery: {
    fullName, email, phone, address, city, state, country,
    zone: 'island' | 'mainland' | 'outside-lagos' | 'outside-nigeria',
    fee: Number,
    notes: String
  },
  payment: {
    provider: 'paystack',
    reference: String,
    status: String,
    amount: Number,
    currency: String,
    paidAt: Date
  },
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  statusHistory: [
    { status: String, timestamp: Date, note: String }
  ],
  coupon: { code: String, discount: Number },
  subtotal: Number,
  deliveryFee: Number,
  discount: Number,
  total: Number,
  timestamps: true
}
```

### Additional Models
- **Category**: `{ name, slug, description, image? }`
- **Coupon**: `{ code, type, value, minPurchase, expiry, usageLimit }`
- **DeliveryZone**: `{ name, regions, fee, estimatedDays }`
- **Review**: `{ user, product, rating, comment, timestamps }`
- **AbandonedCart**: Cart recovery analytics

---

## **Shopping Cart System**

Cart state is managed with **Zustand** and persisted to `localStorage`:

- **Cart Drawer**: Slide-out panel accessible from any page
- **Variant Support**: Products with size/color combinations
- **Real-time Calculation**: Subtotal, inventory validation
- **Persistence**: Survives page reloads and browser sessions
- **Validation**: Server-side cart validation before checkout

---

## **Checkout Flow**

1. **Cart Validation** → Verify items are in stock and prices are current
2. **Delivery Selection** → Choose delivery zone (fee calculation)
3. **Coupon Application** → Optional discount code
4. **Payment Initialization** → Paystack redirect to payment page
5. **Webhook Verification** → Automatic order status update on payment success
6. **Order Confirmation** → Thank you page with order details

---

## **Admin Dashboard**

Accessible at `/admin` (requires admin role):

### Features
- **Overview**: Revenue, orders, users, abandoned carts metrics
- **Products**: Create, edit, delete products with image upload (Cloudinary)
- **Orders**: View all orders, update status, track delivery
- **Users**: View users, ban/unban accounts
- **Coupons**: Create promotional codes with various discount types
- **Delivery Zones**: Configure shipping fees by region

### Security
- Admin routes protected by role check in middleware
- Admin layout includes `SecretGate` component for additional protection
- All admin APIs verify user role before allowing mutations

---

## **Customization**

### Styling

The project uses **Tailwind CSS** with a modern design system:

```javascript
// tailwind.config.js
- Extend colors in `theme.extend.colors`
- Add custom utility classes as needed
- Content paths configured for `src/**/*.{js,jsx,ts,tsx}`
```

### Path Aliases

Configured in `jsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Use alias: `import Product from '@/models/Product'`

---

## **Deployment**

### Vercel (Recommended)

1. Push code to GitHub repository
2. Import project in Vercel dashboard
3. Set environment variables in Vercel project settings
4. Deploy

### Other Platforms

The app is compatible with any Node.js hosting:

- **Railway**, **Render**, **DigitalOcean App Platform**
- **AWS EC2**, **Google Cloud Run**
- **Docker** (custom Dockerfile may be needed)

Ensure:
- Node.js 18+ runtime
- MongoDB instance accessible from deployment environment
- Environment variables properly set

---

## **Scripts**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at http://localhost:3000 |
| `npm run build` | Create optimized production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint on codebase |

---

## **Environment Variables Reference**

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGODB_URI` | Yes (production) | MongoDB connection string | `mongodb://localhost:27017/ecommerce` |
| `JWT_SECRET` | Yes | Secret key for signing JWTs (minimum 32 chars) | `your-very-secure-secret-key-change-this` |
| `PAYSTACK_SECRET_KEY` | Yes (if using payments) | Paystack API secret key | `sk_live_xxxxx` |
| `DEMO_MODE` | No | Enable demo data (true/false) | `true` |
| `CLOUDINARY_CLOUD_NAME` | No | Cloudinary cloud name | `my-cloud` |
| `CLOUDINARY_API_KEY` | No | Cloudinary API key | `1234567890` |
| `CLOUDINARY_API_SECRET` | No | Cloudinary API secret | `secret-key` |
| `BREVO_API_KEY` | No | Brevo (SendInBlue) API key | `xkeysib-xxxxx` |
| `NODE_ENV` | Auto | Set to `production` in production | `production` |

---

## **Testing the Application**

### Demo Testing (No Database)
1. Set `DEMO_MODE=true`
2. Run `npm run dev`
3. Browse products, add to cart, test checkout flow

### Admin Access (Demo Mode)
- URL: `/admin`
- Email: `admin@demo.com`
- Password: `admin123`

### Full Integration Testing
1. Set `DEMO_MODE=false`
2. Configure MongoDB connection
3. Run database migrations/seeds (if available)
4. Create first admin user via registration or MongoDB shell

---

## **Security Considerations**

- **Never** commit `.env.local` to version control
- Use strong, unique `JWT_SECRET` (minimum 32 characters)
- Enable HTTPS in production (`secure: true` cookies)
- Regularly update dependencies: `npm audit`
- Implement CSRF protection for sensitive operations (optional)
- Monitor and rate-limit API endpoints
- Validate all user inputs server-side

---

## **Future Enhancements**

Potential features for expansion:
- [ ] Multi-language / i18n support
- [ ] Advanced search with Elasticsearch/Meilisearch
- [ ] Product recommendations engine
- [ ] Gift cards & wishlist sharing
- [ ] Subscription/recurring orders
- [ ] Mobile app (React Native)
- [ ] Inventory management system
- [ ] Shipment tracking integration (Shippo, EasyShip)
- [ ] Advanced analytics (Google Analytics, Mixpanel)
- [ ] A/B testing framework

---

## **Contributing**

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make changes and test thoroughly
4. Run linter: `npm run lint`
5. Commit with descriptive messages
6. Push to your fork and open a Pull Request

---

## **License**

This project is licensed under the **MIT License**. See LICENSE file for details.

---

## **Support**

For issues, questions, or feature requests:
- Open an issue on GitHub
- Check `DEPENDENCIES.md` for package-specific documentation
- Review the code comments for implementation details

---

## **Acknowledgments**

Built with modern web technologies:
- [Next.js](https://nextjs.org/) - React framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Paystack](https://paystack.com/) - Payments (Nigeria-focused)
- [Cloudinary](https://cloudinary.com/) - Media hosting
- [Lucide](https://lucide.dev/) - Icon set

---

**Happy Shopping! 🛒**

Built with ❤️ using Next.js, MongoDB, and Tailwind CSS.
