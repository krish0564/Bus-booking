# 🚍 Inter-City Bus Booking Service

A scalable web application to manage seat reservations for inter-city buses, supporting:

- Seat availability checks
- Concurrency-safe reservations (1–4 seats)
- Reservation lifecycle with timeout
- Booking cancellation up to 30 minutes before departure
- Authentication
- REST API (OpenAPI 3.0)

---

## 🛠 Tech Stack

- Node.js (Express)
- Sequelize ORM
- MySQL 8.0
- JWT-based Auth
- Swagger (OpenAPI 3.0)
- Docker (optional setup)

---

## 🔧 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourname/bus-booking-service.git
cd bus-booking-service
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment

Create a .env file:

```env
PORT=3000
JWT_SECRET=your_jwt_secret

```

### 4. Initialize DB

Manually via Sequelize

```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

---

## ✅ How to Run

Start the app:

```bash
npm start
```

## 🔐 Authentication

- /api/user/signup — register user
- /api/user/login — get JWT token
- Protected routes require Authorization: Bearer <token>

---

## ✅ Open Design Decisions

| Area                  | Decision & Justification                                                                                                         |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Reservation Lifecycle | A seat stays in RESERVED state for 15 minutes unless BOOKED. Implemented via background job that cleans up expired reservations. |
|                       | Payment is assumed external (e.g., Razorpay, Stripe webhook marks BOOKED).                                                       |
|                       | State transitions: NEW → RESERVED → BOOKED/CANCELLED.                                                                            |
| Concurrency           | SELECT ... FOR UPDATE used inside a Sequelize transaction for strict row-level locking. Ensures seats aren’t double-booked.      |
|                       | Isolation Level: SERIALIZABLE used in Sequelize transaction to prevent phantom reads.                                            |
| Seat Map & Routes     | Seat map is generated from bus.total_seats (not fixed 40).                                                                       |
|                       | Bus, Route, and Departure CRUD is owned by the service (admin-controlled).                                                       |
| Time Handling         | All departure and arrival times are stored in UTC, and converted to local time on frontend if needed.                            |
| API Surface           | RESTful APIs using Express.js. OpenAPI 3.0 used for schema validation and docs.                                                  |
|                       | Auth: JWT with role support (admin/user).                                                                                        |
| Testing & Tooling     | 100% coverage = all controllers, models, auth flows tested using Jest and Supertest.                                             |
|                       | Target: 500 concurrent seat reservations sustained without race conditions.                                                      |
| Ops / Housekeeping    | Background cron job every minute to expire stale RESERVED bookings.                                                              |
|                       | Logging via morgan + Winston, metrics via Prometheus-compatible middleware (optional).                                           |

---

## 🥪 Future Improvements

- Integrate payment service to auto-transition RESERVED → BOOKED.
- Rate-limiting and abuse protection.
- Redis caching for seat availability.
- Admin dashboard UI.
- CI/CD pipeline & GitHub Actions.
- Email notifications for confirmation.

---

## 🗂 Folder Structure

src/
├── controllers/ # Business logic
├── models/ # Sequelize models
├── routes/ # REST endpoints
├── middleware/ # Auth & validation
├── database/ # Sequelize config
├── utils/ # Helpers
└── server.js # Entry point

---

## 🥪 Example API Usage

POST /auth/signup

```json
{
  "name": "krish",
  "email": "krish@gmail.com",
  "password": "12345678"
}
```

POST /booking/reserve

Headers: Authorization: Bearer <token>

```json
{
  "departure_id": 7,
  "seats": [12, 13]
}
```
