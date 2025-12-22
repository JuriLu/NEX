import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { CarManagementComponent } from './features/admin/car-management/car-management.component';
import { BookingComponent } from './features/booking/booking.component';
import { CatalogComponent } from './features/catalog/catalog.component';
import { HomeComponent } from './features/home/home.component';
import { UserDashboardComponent } from './features/user-dashboard/user-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'services', loadComponent: () => import('./features/services/services.component').then(m => m.ServicesComponent) },
  { path: 'contact', loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'booking/:carId', component: BookingComponent, canActivate: [authGuard] },
  { path: 'bookings', component: UserDashboardComponent, canActivate: [authGuard] },
  { path: 'admin', component: CarManagementComponent, canActivate: [adminGuard] },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES) },
  { path: '**', redirectTo: 'auth' } // Fallback for now
];
