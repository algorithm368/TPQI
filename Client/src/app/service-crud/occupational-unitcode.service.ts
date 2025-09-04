import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OccupationalUnitcodeService {

  private apiUrl = 'http://localhost:3000'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  createUnitOccupational(occupational: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createUnitOccupational`, occupational);
  }

  getUnitOccupational(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getUnitOccupational`);
  }

  updateUnitOccupational(id: number, occupational: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateUnitOccupational/${id}`, occupational);
  }

  deleteUnitOccupational(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteUnitOccupational/${id}`);
  }

  getUnitcodes(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getUnitcode`);
  }

  getOccupational(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getOccupational`);
  }
}
