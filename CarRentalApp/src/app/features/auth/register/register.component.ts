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

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    CardModule, InputTextModule, ButtonModule, PasswordModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  submitted = false;

  registerForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s-]+$/)]],
    lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s-]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
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
