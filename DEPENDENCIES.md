# Project Dependencies

This file details all the npm packages installed for the E-commerce Web Application to function correctly. 

## Default Next.js Dependencies
These were installed automatically when initializing `create-next-app@14`:
- `next`: The React Framework for production.
- `react`, `react-dom`: Core React packages.
- `tailwindcss`, `postcss`, `autoprefixer`: For utility-first styling.
- `eslint`, `eslint-config-next`: For linting.

## Additional Integrations

### MongoDB & Mongoose (Database)
- `mongoose`: Elegant MongoDB object modeling for Node.js.
- `mongodb`: MongoDB driver for Node.js.

### Authentication (Custom JWT)
- `jose`: Web Crypto based JSON Web Tokens (JWT) for Edge compatibility.
- `jsonwebtoken`: JSON Web Token implementation for Node.js.
- `bcrypt`: Library to help you hash passwords.

### State Management
- `zustand`: A small, fast, and scalable bearbones state-management solution for React (Used for cart and auth state).

### Payments
- `paystack`: Standard REST fetch calls directly to the Paystack API for secure processing.

### Email Service (Brevo)
- We make standard fetch calls directly to the Brevo API to minimize bundle size.

### Utilities
- `clsx`, `tailwind-merge`: For dynamic tailwind class merging.
- `js-cookie`: Client-side cookie handling.
- `lucide-react`: Modern icon set.
- `validator`: For robust server-side and client-side data validation.

To install these specifically:
```bash
npm install mongoose jose jsonwebtoken bcrypt zustand clsx tailwind-merge lucide-react validator
```
