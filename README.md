# SwiftWheels VRS — Vehicle Rental & Reservation Subsystem

Full-stack MERN application for **SwiftWheels Enterprises** (Huye City, Southern Province, Rwanda).

**Stack:** React + Vite + TailwindCSS  •  Express.js  •  MongoDB + Mongoose

---

## Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI

## 1. Backend setup
```bash
cd backend
npm install
cp .env.example .env        # edit MONGO_URI / ADMIN_PASSWORD if needed
npm run seed                # creates VRS database + admin + sample data
npm run dev                 # runs API at http://localhost:5000
```

### Default seeded accounts
| Role          | Username | Password   |
|---------------|----------|------------|
| Administrator | admin    | Admin@123  |
| Customer      | jean     | Pass@123   |
| Customer      | aline    | Pass@123   |
| Customer      | eric     | Pass@123   |

> Only **one administrator** exists (created from seed). All new self-registered accounts get the `customer` role.

## 2. Frontend setup
```bash
cd frontend
npm install
npm run dev                 # runs UI at http://localhost:5173
```

The Vite dev server proxies `/api/*` to the backend on port 5000.

---

## Features
- Role-based authentication (administrator / customer) with JWT
- Self-registration page (always creates a customer)
- CRUD for **Customers**, **Vehicles**, **Reservations & Rentals**
- Live search on every list
- Customer dashboard with personal reservations
- Full **Customer–Vehicle–Reservation Report** (printable)
- Responsive Tailwind UI

## Entities (MongoDB collections in `VRS`)
- `users` — username, password (hashed), role
- `customers` — full_name, national_id, phone, email, address
- `vehicles` — plate_number, brand, model, year, vehicle_type, purchase_price, status
- `reservations` — customer, vehicle, recorded_by, dates, fees, statuses

## Diagrams
See `diagrams/ERD.png` and `diagrams/DFD-Level0.png`.
