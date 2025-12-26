import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, HostListener } from '@angular/core';
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

  userMenu: MenuItem[] = []; // Kept for reference or future use if needed, but not used in template anymore
  isMenuOpen = false;

  ngOnInit() {
    // Menu items are now hardcoded in HTML for manual control, or could be mapped here.
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  onLogout() {
    this.closeMenu();
    this.store.dispatch(logout());
  }

  // Click Outside Listener
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.user-pill-container'); 
    if (!clickedInside) {
      this.closeMenu();
    }
  }
}
