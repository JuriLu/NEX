import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { UserRole } from '../models/user.model';
import { adminGuard } from './admin.guard';

describe('AdminGuard', () => {
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
    return TestBed.runInInjectionContext(() => adminGuard(route, state));
  };

  it('should allow navigation when user is an admin', async () => {
    storeMock.select.mockReturnValue(of({ role: UserRole.ADMIN }));
    const result = await (runGuard({} as any, {} as any) as any).toPromise();
    expect(result).toBe(true);
  });

  it('should redirect back when user is not an admin (is user)', async () => {
    storeMock.select.mockReturnValue(of({ role: UserRole.USER }));
    routerMock.createUrlTree.mockReturnValue('redirect-url');

    const result = await (runGuard({} as any, {} as any) as any).toPromise();

    expect(result).toBe('redirect-url');
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should redirect back when user is not logged in', async () => {
    storeMock.select.mockReturnValue(of(null));
    routerMock.createUrlTree.mockReturnValue('redirect-url');

    const result = await (runGuard({} as any, {} as any) as any).toPromise();

    expect(result).toBe('redirect-url');
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/auth/login']);
  });
});
