# E-Commerce Admin Panel

Frontend admin dashboard for managing products, orders, and customers.

Built with **Vite** + **Vanilla JS** + **Tailwind CSS**.

## Prerequisites

- Node.js 18+
- Backend API running at `http://localhost:8000` (see backend repo)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Configuration

Edit `src/config/config.js`:

```js
export const config = {
  USE_MOCK: false,          // true = use localStorage mock data, false = real API
  BASE_URL: 'http://localhost:8000/api/v1',
  APP_NAME: 'AdminPanel'
};
```

## Login

The admin account is pre-seeded in the backend — no registration needed.
Use the credentials provided by whoever set up the backend.

## Project Structure

```
src/
├── config/        # App configuration (base URL, mock flag)
├── core/          # Auth, router, event bus
├── services/      # API calls (auth, products, orders, customers)
├── pages/         # Page modules (each exports template + init)
├── components/    # Reusable UI (sidebar, modal, toast)
├── storage/       # localStorage helpers + mock data
├── main.js        # Entry point
└── style.css      # Global styles (Tailwind)
```

## API Endpoints

| Service   | Endpoints                                    | Real API |
|-----------|----------------------------------------------|----------|
| Auth      | `POST /auth/login`                           | Yes      |
| Products  | `GET/POST /products/`, `GET/PATCH/DELETE /products/:id` | Yes |
| Customers | `GET /users/`, `GET /users/:id`              | Yes      |
| Orders    | `GET /orders`, `PUT /orders/:id/status`      | Needs `USE_MOCK: false` |

## Build

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build
```
