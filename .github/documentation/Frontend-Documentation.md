# 💻 NEX: ReadyGo - Frontend Documentation

This document outlines the software architecture, state management, and data flow of the **NEX: ReadyGo** application.

---

## 🏗️ Architecture Overview

The application is built using **Angular 21+** following a modular, feature-based architecture.

### Directory Structure

- **`src/app/core/`**: Singletons and global utilities.
  - `models/`: Interface definitions for Cars, Users, and Bookings.
  - `services/`: Data access layers (CarService, AuthService).
  - `store/`: NgRx state management (Actions, Reducers, Selectors, Effects).
  - `guards/`: Route protection (AdminGuard, AuthGuard).
- **`src/app/features/`**: Independent domain modules.
  - Each feature contains its own components and local styles.
- **`src/app/shared/`**: Reusable UI components (Navbar, Footer, Search, DatePicker, NEX-Form-Field).
- **`src/styles.scss`**: Global design system and MBUX theme tokens.

### Feature Modules Details

- **User Management (`/admin/user-management`)**:
  - **Components**: `UserManagementComponent` handles the admin dashboard view.
  - **Logic**: Combines `NavUser` data with booking history. Manages user status tracking and mission lifecycle.
  - **Features**: Custom delete confirmation dialog (`p-confirmDialog`), glass-morphic status tags, **Async Username Availability Check** (with 500ms debounce).
- **Car Management (`/admin/car-management`)**:
  - **Components**: `CarManagementComponent` for fleet operations.
  - **Features**: Asset image management, real-time availability toggles, and technical spec editing via MBUX-styled dialogs.
- **Profile System (`/profile`)**:
  - **Components**: `ProfileComponent` manages user settings and identity.
  - **Logic**: Persists ambient lighting preferences to `localStorage`. Implements **smart username validation** (ignores current username, debounces updates).
- **Authentication (`/core/auth`)**:
  - **Components**: `AuthComponent` handles login/registration.
  - **Logic**: Includes "Innovative" form validation (glow effects on invalid state), **Async Availability Checks**, and auto-login post-registration.

---

## 🧠 State Management (NgRx)

The application utilizes **NgRx** for centralized state tracking, ensuring a "single source of truth."

### 1. Auth State (`auth.reducer.ts`)

Tracks the current user session and permissions.

- **State Schema**:
  - `user`: Authenticated user object.
  - `isLoggedIn`: Boolean flag.
  - `isAdmin`: Derived from user roles.
  - `loading/error`: Async operation tracking.

### 2. Booking State (`booking.reducer.ts`)

Manages the fleet lifecycle and user reservations.

- **State Schema**:
  - `reservations`: Active and past deployments.
  - `loading/error`: Tracking for mission confirmations.

---

## 🔄 Data Flow Schema

### Mission Booking Flow

1.  **Selection**: User chooses an asset in the `CatalogComponent`.
2.  **Configuration**: `BookingComponent` loads asset details from `CarService`.
3.  **Validation**: Form states are validated against `minDate` and availability.
4.  **Action**: `createReservation` action is dispatched to the Store.
5.  **Effect**: `BookingEffects` handles the API handshake (mocked) and updates the local state.
6.  **Persistence**: User is redirected to "Mission Control" (Dashboard) where `userBookings$` selector displays the new entry.

---

## 🎨 Design System & CSS

The project uses **PrimeNG** as the base component library, but has been heavily customized via `styles.scss`.

- **CSS Variables**: All theme colors are tokenized via `--bg-dark`, `--primary-color`, etc.
- **SCSS Nesting**: We use SCSS nesting and `::ng-deep` to pierce component encapsulation for external libraries (PrimeNG) while maintaining scope.
- **Animations**: Global animations are defined in `styles.scss` (e.g., `slideInAndGlow`) and local animations are added via Angular's `@trigger` system.

---

## 🧪 Testing & Quality Assurance

The application uses **Vitest 4.0.16** as its primary testing engine, integrated with **JSDOM** to simulate the browser environment.

### 1. Test Architecture

- **Framework**: Vitest (replaces Karma/Jasmine for speed and modern ESM support).
- **Environment**: Custom Angular JIT stubber (`angular-resource-stub`) allows testing components without full `ngcc` or complex Analogjs overhead.
- **Reporting**: Integrated **Coverage-v8** reporting and **Vitest UI** (`npm run test:ui`) for graphical test management.

### 2. Coverage Metrics (Current State)

- **Core Services**: 100% coverage for `UserService`, `CarService`, and `ReservationService`.
- **Authentication**: >95% coverage for `AuthService`, including robust error extraction and edge-case handling.
- **State Management**: Full suite of unit tests for Reducers, Selectors, and Effects.
- **Interceptors & Guards**: Verified token injection logic and route protection boundaries.

---

## 🛠️ Security & Sanitization

- **SecurityUtils**: A comprehensive utility in `core/utils/` used for multi-layer sanitization.
  - **HTML Escaping**: Automatically escapes unsafe characters (`& < > " ' / \` =`) to prevent rendering-based injections.
  - **XSS Stripping**: Removes malicious patterns like `javascript:` URIs (quote-aware), `<script>` tags, and unsafe `base64` data while permitting valid image payloads.
  - **Recursive Cleaning**: `sanitizeObject` deeply cleans nested form data while intelligently skipping sensitive cryptographic fields (passwords, tokens).
- **Guards**: `AdminGuard` protects sensitive routes by selecting the `isAdmin` state from the store before permitting navigation.

---

_Technical Documentation updated: 2026-01-05_
