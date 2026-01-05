# 🗄️ NEX: ReadyGo - Backend Documentation

This document outlines the architecture, database schema, and security protocols of the **NEX: ReadyGo** API (NestJS).

---

## 🏗️ Architecture Overview

The backend is built using **NestJS**, following a modular, service-oriented architecture.

### Modules

- **`AppModule`**: The root module that imports all feature modules and configures global settings (Database, Config).
- **`AuthModule`**: Handles authentication strategies (Local, JWT) and token generation.
- **`UsersModule`**: Manages user identity, registration, and profile updates.
- **`CarsModule`**: Manages the vehicle fleet catalog (CRUD operations).
- **`BookingsModule`**: Handles reservation logic and availability checks.

### Core Components

- **Controllers** (`*.controller.ts`): distinct route handlers (e.g., `POST /auth/login`).
- **Services** (`*.service.ts`): Business logic isolation (e.g., Password hashing, DB queries).
- **Schemas/Models** (`*.entity.ts`): Mongoose definitions mapping classes to MongoDB collections.
- **DTOs** (`*.dto.ts`): Data Transfer Objects used for validation (via `class-validator`) of incoming requests.

---

## 💾 Database Schema

The application uses **MongoDB** with **Mongoose** object modeling for data persistence.

### Collections (Schemas)

#### 1. User (`users` collection)

- **id / \_id**: `number` / `ObjectId`
- **email**: `string` (Unique, Indexed)
- **username**: `string` (Unique)
- **password**: `string` (Bcrypt hash)
- **role**: `string` ('admin', 'user')
- **firstName / lastName**: `string`

#### 2. Car (`cars` collection)

- **id / \_id**: `number` / `ObjectId`
- **brand**: `string`
- **model**: `string`
- **year**: `number`
- **pricePerDay**: `decimal`
- **isAvailable**: `boolean`

#### 3. Reservation (`reservations` collection)

- **id / \_id**: `number` / `ObjectId`
- **userId**: `number` (Reference -> User)
- **carId**: `number` (Reference -> Car)
- **startDate**: `Date`
- **endDate**: `Date`
- **status**: `string` ('pending', 'confirmed', 'cancelled', 'completed')

---

## 🔐 Security & Authentication

### JWT Authentication Flow

1.  **Login**: User posts credentials to `/auth/login`.
    - `AuthService` validates email/password (password compared via `bcrypt`).
    - Returns a **signed JWT** (Access Token) containing `sub` (userId) and `role`.
2.  **Protected Routes**:
    - Guarded by `JwtAuthGuard` (integrates `Passport`).
    - Requires `Authorization: Bearer <token>` header.
3.  **Registration**:
    - Passwords are **hashed** with a salt round of 10 before storage.
    - Input DTOs protect against injection by stripping unknown properties (`whitelist: true`).

---

## 📚 API Documentation

Swagger UI is available at `/api` when running the server.

- **Decorators**: We use `@ApiTags`, `@ApiOperation`, and `@ApiResponse` to generate live documentation.
- **Tags**:
  - `Auth`: Authentication endpoints.
  - `Users`: User management.
  - `Cars`: Fleet management.
  - `Bookings`: Reservation operations.
