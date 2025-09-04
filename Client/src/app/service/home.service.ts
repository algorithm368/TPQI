import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';





@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private baseUrl = 'http://localhost:3000'; // Replace with your backend API URL

  private isAuthenticated: boolean = false;

  constructor(private http: HttpClient,) {
    this.isAuthenticated = !!localStorage.getItem('token');
   }



  login(email: string, password: string): Observable<any> {
    const user = { email, password };
    this.isAuthenticated = true;
    return this.http.post(`${this.baseUrl}/login`, user);
    
  }

  
  logout(): void {
    // Remove the JWT token from local storage (assuming you stored it during login)
    localStorage.removeItem('token');
    this.isAuthenticated = false;
  }



  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  

  registerUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, userData);
  }

  resetPassword(data: { email: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, data);
  }

  
}
