import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { login } from '../../../core/store/auth/auth.actions';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: MockStore;
  const initialState = { auth: { loading: false, error: null } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [provideMockStore({ initialState })],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(LoginComponent, {
        set: { template: '<div></div>' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial form state', () => {
    expect(component.loginForm.get('email')?.value).toBe('user@carrental.com');
    expect(component.loginForm.get('password')?.value).toBe('user');
  });

  it('should dispatch login action on valid submit', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'newpassword',
    });

    component.onSubmit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      login({ email: 'test@example.com', password: 'newpassword' })
    );
  });

  it('should not dispatch login action on invalid submit', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.loginForm.patchValue({
      email: 'invalid-email',
      password: '',
    });

    component.onSubmit();

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(component.submitted).toBe(true);
  });
});
