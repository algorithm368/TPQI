import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OccupationalService {

  private apiUrl = 'http://localhost:3000'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  createOccupational(occupational: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createOccupational`, occupational);
  }

  getOccupational(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getOccupational`);
  }

  updateOccupational(id: number, occupational: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateOccupational/${id}`, occupational);
  }

  deleteOccupational(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteOccupational/${id}`);
  }
}
