import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly remoteApiUrl = 'https://gametopup-api.onrender.com/api';
  private readonly localApiUrl = 'http://localhost:3000/api';

  private readonly tokenKey = 'token';
  private readonly userKey = 'auth_user';

  private readonly currentUserSubject = new BehaviorSubject<AuthUser | null>(this.getStoredUser());
  readonly currentUser$ = this.currentUserSubject.asObservable();

  private get apiUrl(): string {
    const override = (window as any).API_BASE_URL;
    if (override) return override;

    const host = window.location.hostname;
    const isLocalHost = host === 'localhost' || host === '127.0.0.1';

    return isLocalHost ? this.localApiUrl : this.remoteApiUrl;
  }

  register(payload: { username: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, payload).pipe(
      map((response) => this.persistSession(response))
    );
  }

  login(payload: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, payload).pipe(
      map((response) => this.persistSession(response))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): AuthUser | null {
    return this.getStoredUser();
  }

  private persistSession(response: AuthResponse): AuthResponse {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
    return response;
  }

  private getStoredUser(): AuthUser | null {
    const rawUser = localStorage.getItem(this.userKey);

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as AuthUser;
    } catch {
      localStorage.removeItem(this.userKey);
      return null;
    }
  }
}
