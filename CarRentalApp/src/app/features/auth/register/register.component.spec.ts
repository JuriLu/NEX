import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MessageService } from 'primeng/api';
import { firstValueFrom, of, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: any;
  let messageServiceMock: any;
  let routerMock: any;
  let store: MockStore;

  const mockUser = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@doe.com' };

  beforeEach(async () => {
    authServiceMock = {
      register: vi.fn().mockReturnValue(of(mockUser)),
      checkUsernameUnique: vi.fn().mockReturnValue(of(true)),
    };

    messageServiceMock = {
      add: vi.fn(),
    };

    routerMock = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
        { provide: Router, useValue: routerMock },
        provideMockStore({ initialState: {} }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(RegisterComponent, {
        set: {
          template: '<div></div>',
          providers: [{ provide: MessageService, useValue: messageServiceMock }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate password match', () => {
    component.registerForm.patchValue({
      password: 'Password123!',
      confirmPassword: 'Different123!',
    });
    expect(component.registerForm.errors?.['mismatch']).toBe(true);

    component.registerForm.patchValue({
      confirmPassword: 'Password123!',
    });
    expect(component.registerForm.errors?.['mismatch']).toBeUndefined();
  });

  it('should call authService.register on valid submit', () => {
    component.registerForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@doe.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    // Ensure form is valid by removing async validator and updating
    component.registerForm.get('username')?.clearAsyncValidators();
    component.registerForm.get('username')?.updateValueAndValidity();
    component.registerForm.updateValueAndValidity();

    expect(component.registerForm.valid).toBe(true);

    component.onSubmit();

    expect(authServiceMock.register).toHaveBeenCalled();
    expect(component.loading).toBe(true);
  });

  it('should handle async username uniqueness', async () => {
    const usernameControl = component.registerForm.get('username');
    authServiceMock.checkUsernameUnique.mockReturnValue(of(false));

    usernameControl?.setValue('existinguser');

    // Wait for timer(500)
    await new Promise((resolve) => setTimeout(resolve, 600));
    fixture.detectChanges();

    expect(authServiceMock.checkUsernameUnique).toHaveBeenCalledWith('existinguser');
    expect(usernameControl?.errors?.['notUnique']).toBe(true);
  });

  it('should dispatch loginSuccess and navigate on successful register', async () => {
    vi.useFakeTimers();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    // @ts-ignore - accessing private for test
    component.handleRegistrationSuccess(mockUser);

    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'success' })
    );
    expect(dispatchSpy).toHaveBeenCalled(); // loginSuccess

    vi.advanceTimersByTime(1500);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/catalog']);
    vi.useRealTimers();
  });
  it('should handle registration error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = { message: 'Failed' };

    // @ts-ignore
    component.handleRegistrationError(error);

    expect(consoleSpy).toHaveBeenCalledWith('Registration failed', error);
    expect(component.loading).toBe(false);
    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error', summary: 'Registration Failed' })
    );
    consoleSpy.mockRestore();
  });

  it('should call handleRegistrationError on service failure', () => {
    const error = { message: 'Network error' };
    authServiceMock.register.mockReturnValue(throwError(() => error));
    const errorSpy = vi.spyOn(component as any, 'handleRegistrationError');

    component.registerForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@doe.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    component.registerForm.get('username')?.clearAsyncValidators();
    component.registerForm.get('username')?.updateValueAndValidity();

    component.onSubmit();

    expect(errorSpy).toHaveBeenCalledWith(error);
  });

  it('should return null if username control has no value in unique validator', async () => {
    const control = { value: '' } as any;
    const result = component.usernameUniqueValidator(control);
    const val = await firstValueFrom(result as any);
    expect(val).toBeNull();
  });

  it('should handle error in usernameUniqueValidator and return null', async () => {
    authServiceMock.checkUsernameUnique.mockReturnValue(throwError(() => new Error('API Error')));
    const usernameControl = component.registerForm.get('username');
    usernameControl?.setValue('someuser');

    // Wait for timer(500)
    await new Promise((resolve) => setTimeout(resolve, 600));
    fixture.detectChanges();

    expect(usernameControl?.errors).toBeNull();
  });
});
