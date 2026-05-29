import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name?: string;
    email?: string;
    role: 'admin' | 'user' | 'guest';
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = '/api/auth/login';

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(this.apiUrl, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem('auth_token'));
  }
}
