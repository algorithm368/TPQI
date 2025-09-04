import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CareerService {

  private apiUrl = 'http://localhost:3000'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  createCareer(career: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createCareer`, career);
  }

  getCareers(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getCareer`);
  }

  updateCareer(id: number, career: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateCareer/${id}`, career);
  }

  deleteCareer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteCareer/${id}`);
  }
}
