import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { logout } from '../../../core/store/auth/auth.actions';
import {
  selectIsAdmin,
  selectIsLoggedIn,
  selectUser,
} from '../../../core/store/auth/auth.selectors';

// PrimeNG
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ToolbarModule } from 'primeng/toolbar';

import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    ButtonModule,
    ToolbarModule,
    AvatarModule,
    MenuModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  store = inject(Store);

  readonly styles = {
    navLinks: ['hidden', 'md:flex', 'nav-links', 'gap-2'],
    userPill: ['user-pill', 'glass-panel', 'px-3', 'py-2'],
    welcomeText: ['welcome-text', 'mr-3', 'hidden', 'lg:inline'],
    authButtons: ['auth-buttons', 'flex', 'gap-2'],
  };

  isLoggedIn$: Observable<boolean> = this.store.select(selectIsLoggedIn);
  user$: Observable<User | null> = this.store.select(selectUser);
  isAdmin$: Observable<boolean> = this.store.select(selectIsAdmin);

  userMenu: MenuItem[] = [];

  ngOnInit() {
    this.userMenu = [
      { label: 'Profile', icon: 'pi pi-user', routerLink: '/profile' },
      { label: 'My Bookings', icon: 'pi pi-calendar', routerLink: '/bookings' },
      { separator: true },
      { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.onLogout() },
    ];
  }

  onLogout() {
    this.store.dispatch(logout());
  }
}
