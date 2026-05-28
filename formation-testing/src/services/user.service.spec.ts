import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { User } from '../interfaces/user';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUsers: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getUsers()', () => {
    it('should fetch all users', () => {
      service.getUsers().subscribe(users => {
        expect(users).toEqual(mockUsers);
        expect(users.length).toBe(2);
        expect(users[0].name).toBe('Alice');
      });

      const req = httpMock.expectOne('/api/users');

      expect(req.request.method).toBe('GET');

      req.flush(mockUsers);
    });

    it('should handle server error', () => {
      let receivedError: any;

      service.getUsers().subscribe({
        next: () => {
          throw new Error('Expected an error');
        },
        error: error => {
          receivedError = error;
        }
      });

      const req = httpMock.expectOne('/api/users');

      expect(req.request.method).toBe('GET');

      req.flush(
        { message: 'Server error' },
        {
          status: 500,
          statusText: 'Internal Server Error'
        }
      );

      expect(receivedError.status).toBe(500);
      expect(receivedError.statusText).toBe('Internal Server Error');
    });
  });

  describe('getUserById()', () => {
    it('should fetch a specific user', () => {
      const mockUser: User = {
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        role: 'admin'
      };

      service.getUserById(1).subscribe(user => {
        expect(user).toEqual(mockUser);
        expect(user.id).toBe(1);
      });

      const req = httpMock.expectOne('/api/users/1');

      expect(req.request.method).toBe('GET');

      req.flush(mockUser);
    });

    it('should handle 404 not found', () => {
      let receivedError: any;

      service.getUserById(999).subscribe({
        next: () => {
          throw new Error('Expected a 404 error');
        },
        error: error => {
          receivedError = error;
        }
      });

      const req = httpMock.expectOne('/api/users/999');

      expect(req.request.method).toBe('GET');

      req.flush(
        { message: 'User not found' },
        {
          status: 404,
          statusText: 'Not Found'
        }
      );

      expect(receivedError.status).toBe(404);
      expect(receivedError.statusText).toBe('Not Found');
    });
  });

  describe('deleteUser()', () => {
    it('should send DELETE request', () => {
      service.deleteUser(1).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne('/api/users/1');

      expect(req.request.method).toBe('DELETE');

      req.flush(null);
    });
  });
});
