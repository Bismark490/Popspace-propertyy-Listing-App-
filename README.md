# PropSpace — Property Listing App

A full-stack web application where users can list, view, update, and delete properties for rent or sale.

## Tech Stack

- **Frontend:** React (Vite) + Custom CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas
- **Auth:** JWT + bcryptjs

## Features

- User registration & login (JWT authentication)
- Browse all properties with filters (city, price, type)
- Create, edit, and delete property listings
- Protected routes — only authors can modify their listings
- Account management (profile update, password change)
- Responsive dark-mode UI

## Project Structure

```
PropSpace/
├── Backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── config/db.js        # MongoDB connection
│   │   ├── models/             # User & Property Mongoose models
│   │   ├── repositories/       # DB query layer
│   │   ├── services/           # Business logic layer
│   │   ├── controllers/        # HTTP request handlers
│   │   ├── middleware/         # Auth & validation middleware
│   │   ├── routes/             # Express routes
│   │   └── server.js           # App entry point
│   └── Frontend/               # React (Vite) frontend
│       └── src/
│           ├── api/            # Axios instance with JWT interceptor
│           ├── context/        # Global auth context
│           ├── components/     # Reusable UI components
│           └── pages/          # All page components
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login + JWT |
| GET | /api/users/profile | Yes | Get profile |
| PUT | /api/users/profile | Yes | Update profile |
| PUT | /api/users/password | Yes | Change password |
| GET | /api/properties | No | Public listing feed |
| GET | /api/properties/mine | Yes | My listings |
| GET | /api/properties/:id | No | Single property |
| POST | /api/properties | Yes | Create listing |
| PUT | /api/properties/:id | Yes | Update (author only) |
| DELETE | /api/properties/:id | Yes | Delete (author only) |

## Running Locally

### Backend
```bash
cd Backend
npm install
npm run dev
```

### Frontend
```bash
cd Backend/Frontend
npm install
npm run dev
```
