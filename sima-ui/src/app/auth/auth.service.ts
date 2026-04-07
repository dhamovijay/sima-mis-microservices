import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of, map } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  username: string;
  role: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8084/api/auth';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private currentUser = new BehaviorSubject<User | null>(null);

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  login(loginRequest: LoginRequest): Observable<boolean> {
  return this.http.post<LoginResponse>(`${this.baseUrl}/login`, loginRequest)
    .pipe(
      tap(response => {
        this.storeTokens(response);
        this.loggedIn.next(true);
        this.router.navigate(['/dashboard']);
      }),
      tap(() => this.loadCurrentUser()),
      map(() => true), // This converts the response to boolean true
      catchError(error => {
        console.error('Login error:', error);
        return of(false); // Return false on error
      })
    );
}

  register(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, registerRequest)
      .pipe(
        tap(() => {
          // Auto login after successful registration
          this.login({
            username: registerRequest.username,
            password: registerRequest.password
          }).subscribe();
        }),
        catchError(error => {
          console.error('Registration error:', error);
          throw error;
        })
      );
  }

  logout(): void {
    // Clear all stored tokens and user data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    
    this.loggedIn.next(false);
    this.currentUser.next(null);
    
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      this.logout();
      throw new Error('No refresh token available');
    }

    return this.http.post<LoginResponse>(`${this.baseUrl}/refresh`, {}, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${refreshToken}`
      })
    }).pipe(
      tap(response => {
        this.storeTokens(response);
      }),
      catchError(error => {
        console.error('Token refresh error:', error);
        this.logout();
        throw error;
      })
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  loadCurrentUser(): void {
    const token = this.getAccessToken();
    if (!token) {
      this.currentUser.next(null);
      return;
    }

    this.http.get<User>(`${this.baseUrl}/users/me`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Failed to load current user:', error);
        return of(null);
      })
    ).subscribe(user => {
      this.currentUser.next(user);
    });
  }

  // Helper method to get authentication headers
  getAuthHeaders(): HttpHeaders {
    const token = this.getAccessToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    const user = this.currentUser.value;
    return user ? user.role === role : false;
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  private storeTokens(response: LoginResponse): void {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    
    // Store user basic info for quick access
    const userInfo = {
      username: response.username,
      role: response.role
    };
    localStorage.setItem('currentUser', JSON.stringify(userInfo));
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  // Auto-login on app initialization
  autoLogin(): void {
    if (this.hasToken()) {
      this.loggedIn.next(true);
      this.loadCurrentUser();
    }
  }

  // Token expiration check (basic implementation)
  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expiry;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }
}