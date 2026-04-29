# 🥗 Protein Pantry Tracker

<div align="center">

**A full-stack nutrition management web application for tracking high-protein pantry items, monitoring stock levels, and generating AI-powered recipes.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-protein--pantry--frontend.onrender.com-4a7c59?style=for-the-badge&logo=render&logoColor=white)](https://protein-pantry-frontend.onrender.com)
[![API](https://img.shields.io/badge/REST%20API-protein--pantry--tracker.onrender.com-2c5f2d?style=for-the-badge&logo=render&logoColor=white)](https://protein-pantry-tracker.onrender.com)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Links](#-live-links)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [API Documentation](#-api-documentation)
- [Data Models](#-data-models)
- [Running Locally](#-running-locally)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Postman Collection](#-postman-collection)

---

## 📖 Overview

Protein Pantry Tracker is a full-stack MERN web application designed to help health-conscious users manage their protein food inventory. Users can log pantry items with quantities, expiration dates, and protein content per unit — then get intelligent insights like low-stock alerts, expiry warnings, a smart grocery list, and AI-generated recipes based on what they currently have stocked.

Built as a university capstone project, the application demonstrates a complete production-grade deployment: a secured REST API with JWT authentication, a NoSQL database, and a responsive React frontend — all deployed and live on Render.

---

## 🔗 Live Links

| Resource | URL |
|---|---|
| **Frontend (React App)** | https://protein-pantry-frontend.onrender.com |
| **Backend API** | https://protein-pantry-tracker.onrender.com |
| **API Health Check** | https://protein-pantry-tracker.onrender.com/ |

---

## ✨ Features

### Authentication & Security
- **User Registration & Login** — secure account creation with hashed passwords (bcryptjs)
- **JWT Authentication** — stateless auth with 24-hour token expiry; every protected route verified server-side
- **Protected Routes** — all item endpoints require a valid Bearer token

### Pantry Management
- **Add Items** — log protein sources with name, category, quantity, unit, expiration date, low-stock threshold, and protein grams per unit
- **Edit Items** — update any item field; consuming an item decrements quantity by one
- **Delete Items** — remove items from the pantry
- **Category System** — items organised into Dairy 🥛, Plant-Based 🌱, and Whole Food 🥦

### Smart Alerts & Filtering
- **Low Stock Detection** — flags any item at or below its custom threshold
- **Expiring Soon** — surfaces items expiring within 7 days with colour-coded urgency (red/amber/green)
- **Filter by Category** — view all items or drill down to a single category
- **Sort by Expiration or Quantity** — surface the most urgent items first

### Nutrition Intelligence
- **Total Protein Dashboard** — aggregates `proteinGrams × quantity` across the entire pantry
- **Days-at-Goal Counter** — calculates how many days the current stock sustains a configurable daily protein goal (default: 150g/day)
- **Breakdown by Category** — separate protein totals for Dairy, Plant-Based, and Whole Food
- **Restock Status Indicator** — live badge showing Well Stocked / Running Low / Restock Needed

### Smart Grocery List
- **Auto-Generated List** — one click produces a plain-text shopping list from all low-stock and expiring-soon items
- **Copy to Clipboard** — instantly copy the list to share or paste into any notes app

### AI Recipe Generator
- **Recipe Generation** — generates three full recipes from current pantry ingredients
- **Filter Modes** — high protein / under 500 calories / quick meals / meal prep
- **Step-by-Step Instructions** — each recipe includes protein content, cook time, and numbered steps

### UI / UX
- **Immersive Hero Header** — animated shifting gradient, botanical SVG leaf motifs, glassmorphism stat pills, circular protein ring
- **Premium Card Design** — warm-cream gradient cards with springy hover animations, category tints, and radial corner glows
- **Ambient Background** — floating botanical SVGs, drifting colour orbs, and a grain/noise texture overlay
- **Fully Responsive** — fluid grid layout works on desktop, tablet, and mobile
- **Editorial Typography** — Playfair Display headings + Inter body text via Google Fonts

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js 18** | JavaScript runtime |
| **Express.js** | REST API framework |
| **MongoDB Atlas** | Cloud NoSQL database |
| **Mongoose** | ODM / schema validation |
| **JSON Web Tokens (JWT)** | Stateless authentication |
| **bcryptjs** | Password hashing (salt rounds: 10) |
| **dotenv** | Environment variable management |
| **cors** | Cross-origin request handling |
| **@anthropic-ai/sdk** | AI recipe generation |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI component library |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client with auth interceptors |
| **Google Fonts** | Playfair Display + Inter typefaces |
| **CSS-in-JS (inline styles)** | Scoped, animation-capable styling |

### Infrastructure
| Service | Role |
|---|---|
| **Render** | Backend API hosting (Web Service) |
| **Render** | Frontend hosting (Static Site) |
| **MongoDB Atlas** | Managed cloud database |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT                              │
│              React SPA (Render Static)                  │
│         protein-pantry-frontend.onrender.com            │
│                                                          │
│  Login / Register → Dashboard → Items Grid              │
│  Nutrition Panel → Grocery List → Recipe Generator      │
└──────────────────────┬──────────────────────────────────┘
                       │  HTTPS + Bearer JWT
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   REST API SERVER                        │
│            Node.js + Express (Render Web)               │
│          protein-pantry-tracker.onrender.com            │
│                                                          │
│  /auth  → Register, Login                               │
│  /items → CRUD + low-stock + expiring + recipes         │
└──────────────────────┬──────────────────────────────────┘
                       │  Mongoose ODM
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  MongoDB Atlas                           │
│           Collections: users · items                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📡 API Documentation

**Base URL:** `https://protein-pantry-tracker.onrender.com`

All `/items` endpoints require the header:
```
Authorization: Bearer <token>
```

---

### Auth Endpoints

#### `POST /auth/register`
Create a new user account.

**Request Body**
```json
{
  "username": "taruni",
  "password": "securepassword123"
}
```

**Response `201`**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "taruni"
}
```

**Error Responses**
| Code | Message |
|---|---|
| `400` | `"Username already exists"` |
| `500` | `"Internal server error"` |

---

#### `POST /auth/login`
Authenticate and receive a JWT.

**Request Body**
```json
{
  "username": "taruni",
  "password": "securepassword123"
}
```

**Response `200`**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "taruni"
}
```

**Error Responses**
| Code | Message |
|---|---|
| `400` | `"Invalid credentials"` |
| `401` | `"No token provided"` |

---

### Item Endpoints

#### `GET /items`
Retrieve all pantry items. Supports optional query parameters.

**Query Parameters**
| Parameter | Type | Values | Description |
|---|---|---|---|
| `category` | string | `dairy`, `plant-based`, `whole food` | Filter by category |
| `sortBy` | string | `expiration`, `quantity` | Sort order |

**Response `200`**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Greek Yogurt",
    "category": "dairy",
    "quantity": 5,
    "unit": "cups",
    "expirationDate": "2025-05-15T00:00:00.000Z",
    "lowStockThreshold": 2,
    "proteinGrams": 17,
    "createdAt": "2025-04-20T10:30:00.000Z"
  }
]
```

---

#### `POST /items`
Add a new item to the pantry.

**Request Body**
```json
{
  "name": "Greek Yogurt",
  "category": "dairy",
  "quantity": 5,
  "unit": "cups",
  "expirationDate": "2025-05-15",
  "lowStockThreshold": 2,
  "proteinGrams": 17
}
```

**Response `201`** — returns the created item object.

**Validation Rules**
- `name`, `category`, `quantity`, `unit`, `expirationDate` are required
- `category` must be one of `dairy`, `plant-based`, `whole food`
- `quantity` must be ≥ 0

---

#### `PUT /items/:id`
Update an existing item (edit fields or consume — decrement quantity).

**Request Body** *(any subset of item fields)*
```json
{
  "quantity": 4
}
```

**Response `200`** — returns the updated item object.

**Error Responses**
| Code | Message |
|---|---|
| `404` | `"Item not found"` |
| `400` | Mongoose validation error |

---

#### `DELETE /items/:id`
Permanently remove an item.

**Response `200`**
```json
{
  "message": "Item deleted successfully"
}
```

---

#### `GET /items/low-stock`
Returns all items where `quantity ≤ lowStockThreshold`.

**Response `200`** — array of item objects (same schema as `GET /items`).

---

#### `GET /items/expiring-soon`
Returns all items with `expirationDate` between today and 7 days from now.

**Response `200`** — array of item objects.

---

#### `POST /items/recipes`
Generate recipe suggestions based on pantry contents.

**Request Body**
```json
{
  "ingredients": "Greek Yogurt (5 cups), Chicken Breast (3 lbs), Cottage Cheese (2 cups)",
  "filter": "high protein"
}
```

**Filter Options**
| Value | Description |
|---|---|
| `high protein` | Maximise protein content |
| `under 500 calories` | Lighter meal options |
| `quick meals` | Under 15 minutes |
| `meal prep` | Batch-cook friendly |

**Response `200`**
```json
{
  "recipe": "Here are 3 high protein recipes using your pantry items:\n\n📖 High-Protein Chicken Bowl\n💪 52g protein | ⏱ 20 mins\n\n1. Season chicken breast..."
}
```

---

### Health Check

#### `GET /`
Verify the API is running.

**Response `200`**
```json
{
  "message": "Protein Pantry Tracker API is running!"
}
```

---

## 🗄 Data Models

### User
```
username    String   required, unique, trimmed
password    String   required, bcrypt-hashed (10 rounds)
```

### Item
```
name              String   required, trimmed
category          String   required — enum: ['dairy', 'plant-based', 'whole food']
quantity          Number   required, min: 0
unit              String   required, trimmed
expirationDate    Date     required
lowStockThreshold Number   required, default: 2
proteinGrams      Number   default: 0
createdAt         Date     default: Date.now
```

---

## 💻 Running Locally

### Prerequisites
- Node.js 18+
- npm 9+
- A [MongoDB Atlas](https://cloud.mongodb.com) cluster (free tier works)

### 1. Clone both repositories

```bash
git clone https://github.com/your-username/protein-pantry-tracker.git
git clone https://github.com/your-username/protein-pantry-frontend.git
```

### 2. Set up the backend

```bash
cd protein-pantry-tracker
npm install
```

Create a `.env` file in the root:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/protein-pantry
JWT_SECRET=your_super_secret_key_here
PORT=3000
```

Start the server:
```bash
npm start
# Server running on http://localhost:3000
```

### 3. Set up the frontend

```bash
cd protein-pantry-frontend
npm install
```

Open `src/api.js` and update the base URL for local development:
```js
const API = axios.create({
  baseURL: 'http://localhost:3000'
});
```

Start the React app:
```bash
npm start
# App running on http://localhost:3001
```

### 4. Open the app

Navigate to [http://localhost:3001](http://localhost:3001), register an account, and start tracking.

---

## 🔐 Environment Variables

### Backend (`.env`)

| Variable | Description | Example |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster...` |
| `JWT_SECRET` | Secret key for signing JWTs | `my_super_secret_key_32chars` |
| `PORT` | Port for the Express server | `3000` |

> **Never commit your `.env` file.** It is listed in `.gitignore`.

---

## 📁 Project Structure

```
protein-pantry-tracker/          ← Backend
├── middleware/
│   └── auth.js                  ← JWT verification middleware
├── models/
│   ├── Item.js                  ← Item Mongoose schema
│   └── User.js                  ← User schema with bcrypt hooks
├── routes/
│   ├── auth.js                  ← Register / Login
│   └── items.js                 ← Full item CRUD + smart endpoints
├── server.js                    ← Express app entry point
├── .env                         ← (gitignored) environment variables
└── package.json

protein-pantry-frontend/         ← Frontend
├── public/
│   └── index.html
├── src/
│   ├── api.js                   ← Axios instance + all API calls
│   ├── App.js                   ← Router setup
│   ├── index.css                ← Global styles + Google Fonts import
│   ├── components/
│   │   └── Navbar.js
│   └── pages/
│       ├── Dashboard.js         ← Main app view (items, nutrition, recipes)
│       ├── Login.js
│       └── Register.js
└── package.json
```

---

## 📸 Screenshots

| View | Preview |
|---|---|
| **Hero Dashboard** | *(screenshot placeholder)* |
| **Nutrition Overview** | *(screenshot placeholder)* |
| **Item Cards** | *(screenshot placeholder)* |
| **Smart Grocery List** | *(screenshot placeholder)* |
| **AI Recipe Generator** | *(screenshot placeholder)* |
| **Login / Register** | *(screenshot placeholder)* |

> To add screenshots: place images in a `/screenshots` folder and replace the placeholders with `![Description](screenshots/filename.png)`.

---

## 📬 Postman Collection

A complete Postman collection covering all endpoints — with example request bodies, auth token setup, and environment variables — is available here:

**[View Postman Collection](#)** ← *(replace `#` with your published Postman link)*

**Quick setup in Postman:**
1. Import the collection
2. Create an environment with variable `base_url` = `https://protein-pantry-tracker.onrender.com`
3. Run `POST /auth/login` — the collection auto-saves the returned token to `{{token}}`
4. All subsequent requests use `{{token}}` in the `Authorization` header automatically

---

## 👩‍💻 Author

**Taruni Sabhavat**
University Project — Full Stack Web Development

---

<div align="center">

Made with 🌿 and a lot of protein.

</div>
