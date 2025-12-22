import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SecurityUtils } from '../../../core/utils/security.utils';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { DESIGN_SYSTEM } from '../../../shared/theme/design-system';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
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

  fb = inject(FormBuilder);
  router = inject(Router);
  submitted = false;

  registerForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s-]+$/)]],
    lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s-]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  loading = false;

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.valid) {
      this.loading = true;
      const sanitizedData = SecurityUtils.sanitizeObject(this.registerForm.value);
      console.log('Register Payload (Sanitized):', sanitizedData);

      // Mock success for now
      setTimeout(() => {
        this.loading = false;
        this.router.navigate(['/auth/login']);
      }, 1500);
    }
  }
}
