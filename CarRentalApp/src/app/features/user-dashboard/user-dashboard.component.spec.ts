import { firstValueFrom, of } from 'rxjs';
import { USER_DASHBOARD_STYLES, UserDashboardComponent } from './user-dashboard.component';

describe('UserDashboardComponent (class-only)', () => {
  let comp: UserDashboardComponent;

  beforeEach(() => {
    // create an object with the component prototype so we avoid Angular DI
    comp = Object.create(UserDashboardComponent.prototype) as UserDashboardComponent;
  });

  it('constructing the class initializes theme and styles', () => {
    // create a real instance so field initializers run
    const real = new UserDashboardComponent();
    expect((real as any).theme).toBeDefined();
    expect((real as any).styles).toBe(USER_DASHBOARD_STYLES);
  });

  it('real instance ngOnInit without DI sets userBookings$ to empty', async () => {
    const real = new UserDashboardComponent();
    // ensure no DI present
    (real as any).store = undefined;
    (real as any).carService = undefined;

    real.ngOnInit();
    const results = await firstValueFrom(real.userBookings$);
    expect(results).toEqual([]);
  });

  it('should expose the exported styles constant', () => {
    // the component assigns styles = USER_DASHBOARD_STYLES
    expect((UserDashboardComponent as any).prototype).toBeDefined();
    // directly assert the exported constant shape
    expect(USER_DASHBOARD_STYLES).toHaveProperty('missionRow');
    expect(USER_DASHBOARD_STYLES).toHaveProperty('carUnitImg');
    expect(USER_DASHBOARD_STYLES).toHaveProperty('tableContainer');
    expect(USER_DASHBOARD_STYLES).toHaveProperty('tableHeader');
  });

  it('getSeverity maps statuses correctly and falls back to secondary', () => {
    const proto = UserDashboardComponent.prototype as any;
    const getSeverity = proto.getSeverity.bind(proto) as (s: string) => string;

    expect(getSeverity('Confirmed')).toBe('success');
    expect(getSeverity('Pending')).toBe('info');
    expect(getSeverity('Cancelled')).toBe('danger');
    expect(getSeverity('SomethingElse')).toBe('secondary');
  });

  it('ngOnInit dispatches loadReservations and maps user bookings', async () => {
    // arrange: provide mocked store and carService
    const mockReservations = [
      { id: 'r1', userId: 'u1', carId: 'c1' },
      { id: 'r2', userId: 'u2', carId: 'c2' },
    ];

    const mockCars = [
      { id: 'c1', name: 'Car 1' },
      { id: 'c2', name: 'Car 2' },
    ];

    const mockUser = { id: 'u1', name: 'User 1' };

    const dispatched: any[] = [];
    let selectCall = 0;
    const mockStore = {
      dispatch: (action: any) => dispatched.push(action),
      select: (selector: any) => {
        // return reservations on first call, user on second call
        selectCall += 1;
        if (selectCall === 1) return of(mockReservations);
        if (selectCall === 2) return of(mockUser);
        return of(null);
      },
    } as any;

    const mockCarService = {
      getCars: () => of(mockCars),
    } as any;

    // inject mocks onto the prototype-backed instance
    (comp as any).store = mockStore;
    (comp as any).carService = mockCarService;

    // call ngOnInit which should set up userBookings$
    comp.ngOnInit();

    // expect a loadReservations action was dispatched
    expect(dispatched.length).toBeGreaterThan(0);

    const results = await firstValueFrom(comp.userBookings$);
    expect(Array.isArray(results)).toBe(true);
    // only one booking matches mockUser.id
    expect(results.length).toBe(1);
    expect(results[0].car).toEqual(mockCars[0]);
  });

  it('ngOnInit returns empty array when no user', async () => {
    const mockStore = {
      dispatch: () => {},
      select: (selector: any) => of(null),
    } as any;

    const mockCarService = { getCars: () => of([]) } as any;

    (comp as any).store = mockStore;
    (comp as any).carService = mockCarService;

    comp.ngOnInit();

    const results = await firstValueFrom(comp.userBookings$);
    expect(results).toEqual([]);
  });

  it('ngOnInit maps booking with missing car to undefined car', async () => {
    const mockReservations = [{ id: 'r1', userId: 'u1', carId: 'missing' }];
    const mockCars: any[] = [];
    const mockUser = { id: 'u1' };

    let selectCall = 0;
    const mockStore = {
      dispatch: () => {},
      select: () => {
        selectCall += 1;
        if (selectCall === 1) return of(mockReservations);
        if (selectCall === 2) return of(mockUser);
        return of(null);
      },
    } as any;

    const mockCarService = { getCars: () => of(mockCars) } as any;

    (comp as any).store = mockStore;
    (comp as any).carService = mockCarService;

    comp.ngOnInit();

    const results = await firstValueFrom(comp.userBookings$);
    expect(results.length).toBe(1);
    expect(results[0].car).toBeUndefined();
  });
});
