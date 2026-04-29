# API Reference — DH Customer APIs
# ══════════════════════════════════════════════════════════

## Base URL
```
VITE_API_BASE_URL=https://your-production-server.com
```
> Replace with the actual server URL provided by the backend team.

---

## Authentication

All endpoints marked **[AUTH]** require a Bearer token in the request header:

```http
Authorization: Bearer {token}
Content-Type: application/json
```

The token is obtained from the Login endpoint and must be stored in
`localStorage` under the key `token`.

---

## ══ GROUP 1 — Authentication & Account ══════════════════

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/api/auth/register` | Register a new customer account | ✗ |
| `POST` | `/api/auth/login` | Login and receive access token | ✗ |
| `POST` | `/api/logout` | Invalidate current session token | ✓ |
| `GET`  | `/api/user` | Get authenticated user profile | ✓ |
| `POST` | `/api/auth/verify-email` | Verify email using OTP code | ✗ |
| `POST` | `/api/auth/verify-phone` | Verify phone number using OTP code | ✗ |
| `POST` | `/api/auth/resend-verification-code` | Resend OTP verification code | ✗ |
| `POST` | `/api/auth/reset-password/send-code` | Send password reset code to email | ✗ |
| `POST` | `/api/auth/reset-password/verify-code` | Validate the reset code | ✗ |
| `POST` | `/api/auth/reset-password/set-new-password` | Set a new password after reset | ✗ |

### Request Bodies

**Register**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0501234567",
  "password": "secret123",
  "password_confirmation": "secret123",
  "country_id": 1
}
```

**Login**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```
> Response contains `token` or `access_token` — save it to localStorage immediately.

**Verify Email / Phone**
```json
{
  "email": "john@example.com",
  "code": "123456"
}
```

**Set New Password**
```json
{
  "email": "john@example.com",
  "code": "123456",
  "password": "newSecret123",
  "password_confirmation": "newSecret123"
}
```

---

## ══ GROUP 2 — Meta / Reference Data ════════════════════

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET` | `/api/countries` | List all available countries | ✗ |

> Countries list is needed during registration (`country_id`) and
> for filtering products by country.

---

## ══ GROUP 3 — Catalog (Public Browsing) ════════════════

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET` | `/api/categories` | List all product categories | ✗ |
| `GET` | `/api/categories/{id}` | Get single category details | ✗ |
| `GET` | `/api/vendors` | List all vendors | ✗ |
| `GET` | `/api/vendors/{id}` | Get single vendor details | ✗ |
| `GET` | `/api/sliders` | Get homepage banners / sliders | ✗ |
| `GET` | `/api/products?country_id={id}&per_page=15` | List products (paginated, by country) | ✗ |
| `GET` | `/api/products/{id}?country_id={id}` | Get single product details | ✗ |

---

## ══ GROUP 4 — Digital Products ══════════════════════════

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET`  | `/api/digital-products?country_id={id}&per_page=15` | List digital products | ✗ |
| `GET`  | `/api/digital-products/{id}?country_id={id}` | Get single digital product | ✗ |
| `POST` | `/api/digital-orders` | Purchase a digital product | ✓ |
| `GET`  | `/api/digital-orders/{order_id}/capture-ip` | Capture IP from email signed link | ✗ |

**Create Digital Order**
```json
{
  "digital_product_id": 42
}
```

---

## ══ GROUP 5 — Cart ══════════════════════════════════════

All cart endpoints require authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`    | `/api/cart` | Retrieve current cart contents |
| `POST`   | `/api/cart` | Add a product to the cart |
| `PUT`    | `/api/cart/{product_id}` | Update item quantity |
| `DELETE` | `/api/cart/{product_id}` | Remove a specific item |
| `DELETE` | `/api/cart` | Clear entire cart |
| `POST`   | `/api/cart/apply-coupon` | Apply a discount coupon |

**Apply Coupon**
```json
{
  "coupon_code": "SUMMER20"
}
```

---

## ══ GROUP 6 — Orders ════════════════════════════════════

All order endpoints require authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/orders` | List all orders for current user |
| `GET`  | `/api/orders/{order_id}` | Get single order details |
| `POST` | `/api/orders` | Place a new order |
| `POST` | `/api/orders/calculate-shipping` | Calculate shipping cost before checkout |
| `POST` | `/api/orders/{order_id}/rate` | Submit rating for a completed order |

**Place Order**
```json
{
  "address_id": 3,
  "coupon_id": null,
  "use_wallet": false,
  "use_points": false,
  "notes": "Please pack carefully"
}
```

**Rate Order**
```json
{
  "rating": 5,
  "comment": "Fast delivery, great condition!"
}
```

---

## ══ GROUP 7 — Payments (Sadad) ══════════════════════════

All payment endpoints require authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/payments/sadad/link` | Generate a Sadad payment link for an order |
| `GET`  | `/api/payments/invoices/{invoice_id}` | Retrieve invoice details |

**Create Sadad Payment Link**
```json
{
  "order_id": 17
}
```

---

## ══ GROUP 8 — Transactions ══════════════════════════════

All transaction endpoints require authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/wallet/history` | Wallet transaction history |
| `GET` | `/api/points/history` | Loyalty points transaction history |

---

## ══ GROUP 9 — Ratings & Reports ════════════════════════

All endpoints require authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/products/{product_id}/rate` | Rate a product |
| `POST` | `/api/products/{product_id}/report` | Report a product |
| `POST` | `/api/vendors/{vendor_id}/report` | Report a vendor |

**Rate a Product**
```json
{
  "rating": 4,
  "comment": "Good quality but late delivery"
}
```

**Report (Product or Vendor)**
```json
{
  "reason": "This item is counterfeit"
}
```

---

## ══ GROUP 10 — Support Tickets ══════════════════════════

All ticket endpoints require authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`    | `/api/tickets` | List all support tickets |
| `POST`   | `/api/tickets` | Open a new support ticket |
| `GET`    | `/api/tickets/{ticket_id}` | Get single ticket with messages |
| `DELETE` | `/api/tickets/{ticket_id}` | Delete a ticket |
| `POST`   | `/api/tickets/{ticket_id}/add-message` | Add a reply to an existing ticket |
| `POST`   | `/api/tickets/{ticket_id}/update-status` | Change ticket status |

**Create Ticket**
```json
{
  "subject": "Order not received",
  "message": "My order #1234 has not arrived after 10 days."
}
```

**Add Message**
```json
{
  "message": "Still waiting for a response, please help."
}
```

**Update Status**
```json
{
  "status": "closed"
}
```
