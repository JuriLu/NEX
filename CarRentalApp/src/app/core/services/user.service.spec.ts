import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpClientMock: any;

  const mockUsers: User[] = [
    {
      id: 1,
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      username: 'admin',
      role: UserRole.ADMIN,
    },
  ];

  beforeEach(() => {
    httpClientMock = {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [UserService, { provide: HttpClient, useValue: httpClientMock }],
    });

    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should return all users', () => {
      httpClientMock.get.mockReturnValue(of(mockUsers));

      service.getUsers().subscribe((users) => {
        expect(users).toEqual(mockUsers);
      });
    });
  });

  describe('updateUser', () => {
    it('should throw error if id is missing', () => {
      expect(() => service.updateUser({ firstName: 'test' })).toThrow();
    });

    it('should update user if id is provided', () => {
      const updatedUser = { ...mockUsers[0], firstName: 'Updated' };
      httpClientMock.patch.mockReturnValue(of(updatedUser));

      service.updateUser({ id: 1, firstName: 'Updated' }).subscribe((user) => {
        expect(user.firstName).toBe('Updated');
      });
    });
  });

  describe('deleteUser', () => {
    it('should send DELETE request', () => {
      httpClientMock.delete.mockReturnValue(of(undefined));
      service.deleteUser(1).subscribe();
      expect(httpClientMock.delete).toHaveBeenCalledWith(expect.stringContaining('/users/1'));
    });
  });

  describe('addUser', () => {
    it('should POST new user', () => {
      httpClientMock.post.mockReturnValue(of(mockUsers[0]));
      service.addUser({ firstName: 'New' }).subscribe((user) => {
        expect(user).toEqual(mockUsers[0]);
      });
      expect(httpClientMock.post).toHaveBeenCalledWith(expect.any(String), { firstName: 'New' });
    });
  });

  describe('updatePassword', () => {
    it('should PATCH password endpoint', () => {
      httpClientMock.patch.mockReturnValue(of(mockUsers[0]));
      const payload = { currentPassword: 'old', newPassword: 'new' };
      service.updatePassword(1, payload).subscribe();
      expect(httpClientMock.patch).toHaveBeenCalledWith(
        expect.stringContaining('/users/1/password'),
        payload
      );
    });
  });

  describe('checkUsernameAvailability', () => {
    it('should call auth endpoint', () => {
      httpClientMock.get.mockReturnValue(of({ isAvailable: true }));
      service.checkUsernameAvailability('test').subscribe((res) => {
        expect(res.isAvailable).toBe(true);
      });
      expect(httpClientMock.get).toHaveBeenCalledWith(
        expect.stringContaining('/auth/check-username/test')
      );
    });
  });
});
