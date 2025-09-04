import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {

  private apiUrl = 'http://localhost:3000'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  createDetails(details: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createDetails`, details);
  }

  getDetails(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getDetails`);
  }

  updateDetails(id: number, details: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateDetails/${id}`, details);
  }

  deleteDetails(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteDetails/${id}`);
  }

}
