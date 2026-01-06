import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { login } from '../../../core/store/auth/auth.actions';
import { selectAuthError, selectAuthLoading } from '../../../core/store/auth/auth.selectors';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { animate, style, transition, trigger } from '@angular/animations';
import { DESIGN_SYSTEM } from '../../../shared/theme/design-system';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    CheckboxModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [
    trigger('loginAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class LoginComponent {
  readonly theme = DESIGN_SYSTEM;

  readonly styles = {
    authWrapper: [
      'auth-wrapper',
      'flex',
      'align-items-center',
      'justify-content-center',
      'min-h-screen',
      'relative',
      'overflow-hidden',
    ],
    authCard: ['glass-panel', 'auth-card', 'p-5', 'relative', 'overflow-hidden'],
    logoBox: ['auth-logo-box', 'mb-4', 'glass-panel', 'inline-flex', 'p-3'],
    validationWarning: ['validation-warning'],
    label: [
      'block',
      'text-secondary',
      'font-bold',
      'uppercase',
      'tracking-widest',
      'text-xs',
      'mb-2',
    ],
  };

  fb: FormBuilder = inject(FormBuilder);
  store: Store = inject(Store);
  submitted: boolean = false;

  loginForm: FormGroup = this.fb.group({
    email: ['user@carrental.com', [Validators.required, Validators.email]],
    password: ['user', [Validators.required]], // Pre-filled for demo
  });

  loading$: Observable<boolean> = this.store.select(selectAuthLoading);
  error$: Observable<string | null> = this.store.select(selectAuthError);

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.store.dispatch(login({ email, password }));
    }
  }
}
