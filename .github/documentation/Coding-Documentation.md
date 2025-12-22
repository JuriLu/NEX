# 💻 NEX: ReadyGo - Technical & Coding Documentation

This document outlines the software architecture, state management, and data flow of the **NEX: ReadyGo** application.

---

## 🏗️ Architecture Overview

The application is built using **Angular 19+** following a modular, feature-based architecture.

### Directory Structure
- **`src/app/core/`**: Singletons and global utilities.
    - `models/`: Interface definitions for Cars, Users, and Bookings.
    - `services/`: Data access layers (CarService, AuthService).
    - `store/`: NgRx state management (Actions, Reducers, Selectors, Effects).
    - `guards/`: Route protection (AdminGuard, AuthGuard).
- **`src/app/features/`**: Independent domain modules.
    - Each feature contains its own components and local styles.
- **`src/app/shared/`**: Reusable UI components (Navbar, Footer, Search).
- **`src/styles.scss`**: Global design system and MBUX theme tokens.

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

## 🛠️ Security & Sanitization
- **SecurityUtils**: A dedicated utility in `core/utils/` used for sanitizing objects and stripping potential XSS payloads from forms (especially in Admin Ops Center).
- **Guards**: `AdminGuard` protects sensitive routes by selecting the `isAdmin` state from the store before permitting navigation.

---
*Technical Documentation updated: 2025-12-22*
