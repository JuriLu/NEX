# 📘 NestJS Backend Implementation Guide

This guide explains the backend implementation for the Car Rental AI project. It is designed for developers with no prior experience in NestJS or Backend development.

## 🏗️ Core Concepts

NestJS is a framework for building efficient, scalable Node.js server-side applications. It uses modern JavaScript/TypeScript and is heavily inspired by Angular, so many concepts (Modules, Services, Dependency Injection) will feel familiar.

### 1. Modules (`*.module.ts`)
Modules are used to organize the application structure. They group related controllers and services together.
- **AppModule**: The root module that imports all other modules.
- **Feature Modules**: `UsersModule`, `CarsModule`, `BookingsModule`, `AuthModule`.

### 2. Controllers (`*.controller.ts`)
Controllers are responsible for handling incoming **requests** and returning **responses** to the client.
- They use decorators like `@Get()`, `@Post()`, `@Body()`, `@Param()` to define routes.
- Example: `CarsController` handles requests to `/cars`.

### 3. Services (`*.service.ts`)
Services contain the **business logic**. Controllers delegate tasks to services.
- They interact with the database.
- Example: `CarsService` has methods like `findAll()`, `create()`, which use the database repository.

### 4. Entities (`*.entity.ts`)
Entities define the **database schema**. We use **TypeORM**, an Object-Relational Mapper (ORM), which maps these TypeScript classes to database tables.
- Example: `Car` entity maps to a `car` table with columns like `brand`, `model`, `pricePerDay`.

### 5. DTOs (Data Transfer Objects) (`*.dto.ts`)
DTOs define the shape of data sent over the network. They are used for **validation**.
- We use `class-validator` decorators (e.g., `@IsString()`, `@IsNotEmpty()`) to ensure the data sent by the frontend is correct before it reaches our logic.

---

## 🛠️ Implementation Details

### 1. Database Setup (SQLite & TypeORM)
We chose **SQLite** because it's a serverless, file-based SQL database. It requires no installation or configuration, making it perfect for development.

- **Configuration**: In `app.module.ts`, we configured `TypeOrmModule` to use `sqlite` and store data in `car_rental.db`.
- **Synchronization**: `synchronize: true` is set, which means TypeORM automatically creates/updates database tables based on your Entity files.

### 2. Authentication (JWT & Passport)
We implemented a secure authentication system using **JSON Web Tokens (JWT)**.

- **Flow**:
    1. User sends credentials (email/password) to `/auth/login`.
    2. `AuthService` validates them.
    3. If valid, it returns a **JWT** (Access Token).
    4. Frontend stores this token and sends it in the `Authorization` header (`Bearer <token>`) for subsequent requests.
- **Guards**: We created `JwtAuthGuard`. When placed on a route (e.g., `@UseGuards(JwtAuthGuard)`), it ensures only logged-in users with a valid token can access that route.

### 3. Swagger Documentation
Swagger provides an interactive interface to test your APIs.

- **Setup**: In `main.ts`, we configured `DocumentBuilder` and `SwaggerModule`.
- **Decorators**: We added `@ApiProperty`, `@ApiOperation`, `@ApiTags` to our code to make the documentation rich and descriptive.
- **Access**: Available at `http://localhost:3000/api`.

---

## 📂 Folder Structure Explained

```
src/
├── app.module.ts        # Root module, connects DB and feature modules
├── main.ts              # Entry point, sets up Swagger, CORS, Validation
├── auth/                # Authentication logic
│   ├── jwt.strategy.ts  # How to validate JWT tokens
│   ├── local.strategy.ts# How to validate email/password
│   └── ...
├── users/               # User management
│   ├── entities/        # User database table definition
│   └── ...
├── cars/                # Car catalog management
│   └── ...
└── bookings/            # Reservation management
    └── ...
```

---

## 🚀 How to Run & Test

1.  **Start the Server**:
    ```bash
    npm run start:dev
    ```
    This starts the server in "watch mode", meaning it restarts automatically when you save a file.

2.  **Open Swagger**:
    Go to [http://localhost:3000/api](http://localhost:3000/api).

3.  **Test the Flow**:
    - **Register**: Use `POST /auth/register` to create a user.
    - **Login**: Use `POST /auth/login` with those credentials. Copy the `access_token` from the response.
    - **Authorize**: Click the "Authorize" button at the top of Swagger, type `Bearer <your_token>`, and click "Authorize".
    - **Create Data**: Now you can use protected endpoints like `POST /cars` or `POST /bookings`.

## 📚 Next Steps for You
- **Connect Frontend**: Use Angular's `HttpClient` to call these endpoints.
- **Environment Variables**: Currently, secrets are hardcoded. In production, use `.env` files (we installed `@nestjs/config` for this).
- **Business Logic**: Expand the services. For example, in `BookingsService`, check if a car is actually available before creating a booking.
