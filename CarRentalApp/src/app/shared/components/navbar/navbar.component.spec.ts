import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as AuthActions from '../../../core/store/auth/auth.actions';
import {
  selectIsAdmin,
  selectIsLoggedIn,
  selectUser,
} from '../../../core/store/auth/auth.selectors';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let store: MockStore;

  const initialState = {
    auth: {
      user: null,
      loading: false,
      error: null,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([]),
        provideMockStore({
          initialState,
          selectors: [
            { selector: selectIsLoggedIn, value: false },
            { selector: selectUser, value: null },
            { selector: selectIsAdmin, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle menu', () => {
    expect(component.isMenuOpen).toBe(false);
    component.toggleMenu();
    expect(component.isMenuOpen).toBe(true);
    component.toggleMenu();
    expect(component.isMenuOpen).toBe(false);
  });

  it('should close menu', () => {
    component.isMenuOpen = true;
    component.closeMenu();
    expect(component.isMenuOpen).toBe(false);
  });

  it('should dispatch logout action onLogout', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.onLogout();
    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.logout());
    expect(component.isMenuOpen).toBe(false);
  });

  it('should close menu when clicking outside', () => {
    component.isMenuOpen = true;
    const event = new MouseEvent('click', { bubbles: true });
    // Mock target that is not a child of .user-pill-container
    document.body.dispatchEvent(event);
    expect(component.isMenuOpen).toBe(false);
  });

  it('should NOT close menu when clicking inside user-pill-container', () => {
    component.isMenuOpen = true;

    // Create a mock element with the container class
    const container = document.createElement('div');
    container.className = 'user-pill-container';

    // We can't easily mock target.closest in a simple MouseEvent in JSDOM manually without real DOM structure
    // but we can mock the event itself or just call the handler with a fake event.

    const fakeEvent = {
      target: {
        closest: (selector: string) => (selector === '.user-pill-container' ? container : null),
      },
    } as unknown as MouseEvent;

    component.onDocumentClick(fakeEvent);
    expect(component.isMenuOpen).toBe(true);
  });
});
