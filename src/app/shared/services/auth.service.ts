import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'isAdminAuthenticated';
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkStoredAuth());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router, private http: HttpClient) {
    this.checkSessionExpiry();
  }

  async login(password: string): Promise<boolean> {
    try {
      console.log('Attempting login with URL:', `${environment.apiUrl}/admin/login`);
      console.log('Password length:', password.length);
      
      const response = await this.http.post<{success: boolean, message: string}>(
        `${environment.apiUrl}/admin/login`,
        { password }
      ).toPromise();

      console.log('Server response:', response);

      if (response?.success) {
        const authData = {
          authenticated: true,
          timestamp: Date.now()
        };
        
        localStorage.setItem(this.AUTH_KEY, JSON.stringify(authData));
        this.isAuthenticatedSubject.next(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/admin']);
  }

  isAuthenticated(): boolean {
    return this.checkStoredAuth();
  }

  private checkStoredAuth(): boolean {
    try {
      const authData = localStorage.getItem(this.AUTH_KEY);
      if (!authData) return false;

      const parsed = JSON.parse(authData);
      const now = Date.now();
      
      // Check if session has expired
      if (now - parsed.timestamp > this.SESSION_TIMEOUT) {
        this.logout();
        return false;
      }
      
      return parsed.authenticated === true;
    } catch {
      return false;
    }
  }

  private checkSessionExpiry(): void {
    // Check session expiry every minute
    setInterval(() => {
      if (!this.checkStoredAuth()) {
        this.isAuthenticatedSubject.next(false);
      }
    }, 60000);
  }
} 