# Integration Guide — Connecting the Frontend to the Backend API
# ══════════════════════════════════════════════════════════════════

## Read Before Doing Anything

The React frontend is **complete and fully functional**.
Do not touch the UI. Do not refactor anything.
Your only job is to connect each existing screen to its corresponding API endpoint.

---

## Step 1 — Environment Setup

Create a `.env` file in the project root (next to `package.json`):

```env
VITE_API_BASE_URL=https://your-production-server.com
```

> Never commit this file. Make sure `.env` is listed in `.gitignore`.

---

## Step 2 — Create the Shared Axios Instance

Create the file `/src/services/api.js` with the following content.
This is the **only** HTTP client in the entire project — all service
files must import from here.

```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ──────────────────────────────────
// Attach the auth token to every outgoing request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response Interceptor ─────────────────────────────────
// Handle global errors (e.g. expired session)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## Step 3 — Integration Order

Work through the endpoints in this exact order.
Complete and test each group before moving to the next.

```
Priority  Group                   Reason
────────  ──────────────────────  ─────────────────────────────────────
  1       Auth                    Everything else depends on having a token
  2       Meta / Countries        Needed inside the Register form
  3       Catalog                 Core product browsing — highest visibility
  4       Cart                    Enables the purchase flow
  5       Orders                  Completes the checkout journey
  6       Payments (Sadad)        Closes the transaction loop
  7       Transactions            Wallet + Points history
  8       Ratings & Reports       Secondary user actions
  9       Tickets                 Support flow
  10      Digital Products        Separate product type
```

---

## Service File Pattern

For each group, create one service file. Follow this pattern exactly:

```js
// /src/services/products.service.js

import api from './api';

export const getProducts = async (countryId, page = 1) => {
  const res = await api.get('/api/products', {
    params: { country_id: countryId, page, per_page: 15 },
  });
  return res.data;
};

export const getProduct = async (id, countryId) => {
  const res = await api.get(`/api/products/${id}`, {
    params: { country_id: countryId },
  });
  return res.data;
};
```

### Service Files to Create

| File | Covers |
|------|--------|
| `/src/services/api.js` | Shared axios instance (base) |
| `/src/services/auth.service.js` | Login, Register, Logout, Verify, Reset Password |
| `/src/services/meta.service.js` | Countries |
| `/src/services/catalog.service.js` | Categories, Vendors, Sliders, Products |
| `/src/services/digital.service.js` | Digital Products + Digital Orders |
| `/src/services/cart.service.js` | Cart CRUD + Apply Coupon |
| `/src/services/orders.service.js` | Orders CRUD + Shipping + Rating |
| `/src/services/payments.service.js` | Sadad payment link + Invoice |
| `/src/services/transactions.service.js` | Wallet history + Points history |
| `/src/services/ratings.service.js` | Rate product + Report product/vendor |
| `/src/services/tickets.service.js` | Support tickets CRUD |

---

## Handling API Response Shape Mismatches

When the API returns data in a different shape than the UI expects,
**always adapt the data in the service layer — never touch the component.**

```js
// ❌ WRONG — modifying the component to accept a different prop shape
// ✅ CORRECT — transforming inside the service

export const getVendors = async () => {
  const res = await api.get('/api/vendors');

  // API returns: { data: { vendors_list: [...] } }
  // UI expects:  { vendors: [...] }
  return {
    vendors: res.data.data.vendors_list,
  };
};
```

---

## Screens Without an API Endpoint

If a screen exists in the UI but no endpoint was provided for it:

```js
// ✅ Return empty data — do NOT delete the screen
export const getNotifications = async () => ({ notifications: [] });
```

---

## Progress Tracker

Update this section as you complete each group.

```
[ ] Step 1 — Create .env file
[ ] Step 2 — /src/services/api.js (axios instance)

[ ] Auth          — login, register, logout, verify, reset password
[ ] Countries     — GET /api/countries
[ ] Catalog       — categories, vendors, sliders, products
[ ] Cart          — view, add, update, remove, clear, coupon
[ ] Orders        — list, detail, place order, shipping, rate
[ ] Payments      — Sadad link, invoice
[ ] Transactions  — wallet history, points history
[ ] Ratings       — rate product, report product, report vendor
[ ] Tickets       — list, create, view, reply, close
[ ] Digital       — products list, product detail, create order
```

---

## Cursor Prompting Tips

When working with Cursor, always scope your instructions tightly:

```
✅ Good prompt:
"Read cursor_docs/api-endpoints.md and cursor_docs/integration-guide.md first.
Then create /src/services/auth.service.js with functions for login and register only.
Show me the code before applying it. Do not touch any other file."

❌ Bad prompt:
"Connect the frontend to the backend."
```

One endpoint group per session. Always ask Cursor to show the plan first.
