import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CareerlevelUnitcodeService {

  private apiUrl = 'http://localhost:3000'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  createClAndUn(clun: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createClAndUn`, clun);
  }

  getClAndUns(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getClAndUns`);
  }

  updateClAndUn(id: number, clun: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateClAndUn/${id}`, clun);
  }

  deleteClAndUn(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteClAndUn/${id}`);
  }

  getCareerLevel(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getCareerLevel`);
  }

  getUnitcodes(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getUnitcode`);
  }

}
