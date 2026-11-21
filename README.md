
# NovaStore

**NovaStore** is a full-stack e-commerce web application for browsing products, managing shopping carts, and placing orders.

## ✨ Features

- User registration and login
- JWT-based authentication
- Product listing and product details
- Shopping cart management
- Order placement and inventory management
- Personal order history
- Order detail pages
- Protected routes
- Responsive tech-style user interface

## 🛠️ Tech Stack

### Frontend

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Axios

### Backend

- Node.js
- Express
- MySQL
- JWT
- bcryptjs

## 📁 Project Structure

```text
novastore/
├── public/
│   └── images/
├── server/
│   └── src/
│       ├── config/
│       ├── middleware/
│       └── routes/
├── src/
│   ├── api/
│   ├── components/
│   ├── composables/
│   ├── router/
│   ├── stores/
│   └── views/
├── package.json
└── README.md
```

## 🚀 Getting Started

### 1. Install frontend dependencies

```bash
pnpm install
```

### 2. Configure the database

Create a MySQL database named `novastore` and configure the database connection in `server/.env`.

Example:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=novastore
DB_PORT=3306
JWT_SECRET=your_secret_key
PORT=3000
```

Replace the example values with your own local configuration.

### 3. Install backend dependencies

```bash
cd server
pnpm install
```

### 4. Start the backend

```bash
pnpm dev
```

### 5. Start the frontend

Open another terminal in the project root:

```bash
pnpm dev
```

Frontend: http://localhost:5173

Backend: http://localhost:3000

## 📝 Notes

- Do not commit `.env` files or private credentials.
- Make sure MySQL is running before starting the backend.

---

**NovaStore** | Full-Stack E-Commerce Project
