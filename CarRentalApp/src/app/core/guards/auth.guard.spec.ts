import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { authGuard } from './auth.guard';

describe('AuthGuard', () => {
  let storeMock: any;
  let routerMock: any;

  beforeEach(() => {
    storeMock = {
      select: vi.fn(),
    };
    routerMock = {
      createUrlTree: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  const runGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return TestBed.runInInjectionContext(() => authGuard(route, state));
  };

  it('should allow navigation when user is logged in', async () => {
    storeMock.select.mockReturnValue(of(true));
    const result = await (runGuard({} as any, { url: '/dashboard' } as any) as any).toPromise();
    expect(result).toBe(true);
  });

  it('should redirect to login when user is not logged in', async () => {
    const returnUrl = '/dashboard';
    storeMock.select.mockReturnValue(of(false));
    routerMock.createUrlTree.mockReturnValue('redirect-url');

    const result = await (runGuard({} as any, { url: returnUrl } as any) as any).toPromise();

    expect(result).toBe('redirect-url');
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/auth/login'], {
      queryParams: { returnUrl },
    });
  });
});
