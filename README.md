# 🧾 Sistema de Facturación — Backend API

RESTful API backend for a billing and invoicing management system. Built with **Node.js** and **Express**, powered by **Firebase Firestore** as the database. It provides full CRUD operations for products, clients, suppliers, categories, sales, employees, and daily revenue reports.

> 🔗 **Live Demo:** https://sistema-facturacion-front-roan.vercel.app/

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
  - [Running with Docker](#running-with-docker)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Employees](#employees)
  - [Categories](#categories)
  - [Products](#products)
  - [Suppliers](#suppliers)
  - [Clients](#clients)
  - [Sales](#sales)
  - [Reports](#reports)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [License](#license)

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express** | Web framework |
| **Firebase Admin SDK** | Firestore database & authentication |
| **Nodemailer** | Email service (password recovery) |
| **Bcrypt** | Password hashing |
| **Helmet** | HTTP security headers |
| **CORS** | Cross-origin resource sharing |
| **express-rate-limit** | Rate limiting (demo mode) |
| **Docker** | Containerization |
| **GitHub Actions** | CI/CD pipeline |

---

## Features

- 🔐 **Session-based authentication** with secure HTTP-only cookies
- 📦 **Full CRUD** for products, clients, suppliers, categories, and sales
- 👥 **Employee management** with role-based access
- 📊 **Daily revenue reports** with date range filtering and payment method breakdown
- 📧 **Password recovery** via email
- 🛡️ **Security hardened** with Helmet, CORS whitelist, and rate limiting
- 🎮 **Demo mode** with configurable request limits
- 🐳 **Docker-ready** with non-root user and automated deployments

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A **Firebase project** with Firestore enabled
- A Firebase **Service Account Key** (JSON file)

### Installation

```bash
# Clone the repository
git clone https://github.com/AugustoC01/sistema-facturacion-back.git
cd sistema-facturacion-back

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory based on the `.example.env` template:

```env
# API Configuration
PORT = 8080
CORS_ORIGINS = https://yourdomain.com
NODE_ENV = development
APP_MODE = production
MAX_LIMIT = 30

# Firebase
GOOGLE_APPLICATION_CREDENTIALS = ./serviceAccountKey.json

# Nodemailer (Gmail)
SENDER = your-email@gmail.com
PASS = your-app-password
```

| Variable | Description |
|---|---|
| `PORT` | Server port (default: `8080`) |
| `CORS_ORIGINS` | Comma-separated list of allowed origins |
| `NODE_ENV` | `development` or `production` — dev mode auto-allows `localhost:5173` |
| `APP_MODE` | Set to `demo` to enable rate limiting |
| `MAX_LIMIT` | Max daily requests allowed in demo mode (default: `30`) |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to your Firebase service account JSON file |
| `SENDER` | Email address used for sending password recovery emails |
| `PASS` | App password for the sender email account |

### Running Locally

```bash
npm run dev
```

The server will start on `http://localhost:<PORT>` with hot-reload via Nodemon.

### Running with Docker

```bash
# Build the image
docker build -t sistema-facturacion-back .

# Run the container
docker run -p 8080:8080 \
  --env-file .env \
  -v /path/to/serviceAccountKey.json:/app/secrets/serviceAccountKey.json \
  sistema-facturacion-back
```

---

## Project Structure

```
src/
├── index.js              # App entry point & middleware setup
├── config.js             # Environment config & CORS options
├── controllers/          # Request handlers
│   ├── authController.js
│   ├── categoryController.js
│   ├── clientController.js
│   ├── employeeController.js
│   ├── productController.js
│   ├── reportsController.js
│   ├── saleController.js
│   └── supplierController.js
├── routes/               # Route definitions
│   ├── router.js         # Main router (mounts all sub-routes)
│   ├── authRoute.js
│   ├── categoryRoute.js
│   ├── clientRoute.js
│   ├── employeeRoute.js
│   ├── productRoute.js
│   ├── reportRoute.js
│   ├── saleRoute.js
│   └── supplierRoute.js
├── middleware/
│   ├── userAuth.js       # Session authentication middleware
│   └── demoRateLimiter.js
├── service/
│   ├── firebase.js       # Firebase Admin SDK initialization
│   ├── db.js             # Generic Firestore CRUD operations
│   └── employeeService.js
└── utils/
    ├── bcrypt.js          # Password hashing helpers
    ├── idGenerator.js     # Unique ID generation (nanoid)
    ├── nodemailer.js      # Email sending
    └── objectUtils.js
```

---

## API Documentation

> ⚠️ All endpoints except `/user/*` require an active session cookie (`sessionId`). Unauthenticated requests will receive a `401 Unauthorized` response.

Base URL: `http://localhost:8080`

---

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/user/signup` | Register a new employee |
| `POST` | `/user/login` | Log in and receive a session cookie |
| `POST` | `/user/logout` | Log out and clear the session |
| `POST` | `/user/forgotPassword` | Send a password recovery email |

<details>
<summary><strong>Request / Response Details</strong></summary>

#### POST `/user/signup`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### POST `/user/login`
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```
✅ On success, a `sessionId` cookie is set automatically.

#### POST `/user/logout`
No body required. Clears the session cookie.

#### POST `/user/forgotPassword`
```json
{
  "email": "john@example.com"
}
```
📧 A new auto-generated password will be sent to the provided email.

</details>

---

### Employees

🔒 *Requires authentication*

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/employees` | Get all employees |
| `GET` | `/employees/:id` | Get employee by ID |
| `PUT` | `/employees/:id` | Update employee |
| `DELETE` | `/employees/:id` | Delete employee |

---

### Categories

🔒 *Requires authentication*

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/categories` | Get all categories |
| `GET` | `/categories/:id` | Get category by ID |
| `POST` | `/categories` | Create a new category |
| `PUT` | `/categories/:id` | Update a category |
| `DELETE` | `/categories/:id` | Delete a category |

---

### Products

🔒 *Requires authentication*

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/products` | Get all products |
| `GET` | `/products/:id` | Get product by ID |
| `POST` | `/products` | Create a new product |
| `PUT` | `/products/:id` | Update a product |
| `DELETE` | `/products/:id` | Delete a product |

**Filtering & Queries:**

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/products/category/:categoryId` | Get products by category |
| `GET` | `/products/supplier/:supplierId` | Get products by supplier |
| `GET` | `/products/stock/enabled` | Get products in stock |
| `GET` | `/products/stock/disabled` | Get out-of-stock products |
| `GET` | `/products/stock/:quantity` | Get products with stock below a quantity |
| `GET` | `/products/higherPrice/:price` | Get products above a price |
| `GET` | `/products/lowerPrice/:price` | Get products below a price |

**Field Operations:**

| Method | Endpoint | Description |
|---|---|---|
| `DELETE` | `/products/remove/:id/field` | Delete a specific field from a product |

---

### Suppliers

🔒 *Requires authentication*

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/suppliers` | Get all suppliers |
| `GET` | `/suppliers/:id` | Get supplier by ID |
| `POST` | `/suppliers` | Create a new supplier |
| `PUT` | `/suppliers/:id` | Update a supplier |
| `DELETE` | `/suppliers/:id` | Delete a supplier |

---

### Clients

🔒 *Requires authentication*

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/clients` | Get all clients |
| `GET` | `/clients/:id` | Get client by ID |
| `POST` | `/clients` | Create a new client |
| `PUT` | `/clients/:id` | Update a client |
| `DELETE` | `/clients/:id` | Delete a client |

---

### Sales

🔒 *Requires authentication*

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/sales` | Get all sales |
| `GET` | `/sales/:id` | Get sale by ID |
| `POST` | `/sales` | Create a new sale |
| `PUT` | `/sales/:id` | Update a sale |
| `DELETE` | `/sales/:id` | Delete a sale |

> 📊 Creating or deleting a sale automatically updates the daily revenue report.

---

### Reports

🔒 *Requires authentication*

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/reports` | Get all daily reports |
| `GET` | `/reports/days/:begin/:end` | Get total revenue between two dates |

> Date format for the range query: `DD-MM-YYYY` (e.g., `/reports/days/01-01-2025/31-01-2025`)

---

## Deployment

This project includes a **GitHub Actions** workflow that automatically deploys to a VPS on every push to `main`. The pipeline connects via SSH and runs a deployment script on the server.

Required GitHub Secrets:
- `VPS_HOST` — Server IP/hostname
- `VPS_USER` — SSH username
- `SSH_PRIVATE_KEY` — Private SSH key

---

## Roadmap

- [ ] Expand employees management features
- [ ] Expand providers/suppliers management
- [ ] Add more analytics and reporting capabilities

---

## License

This project is licensed under the **ISC** license.

---

<p align="center">
  Made with ❤️ by <strong>Augusto</strong>
</p>
