import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CareerLevelService {

  private apiUrl = 'http://localhost:3000'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  createCareerLevel(careerlevel: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createCareerLevel`, careerlevel);
  }

  getCareerLevel(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getCareerLevel`);
  }

  updateCareerLevel(id: number, careerlevel: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateCareerLevel/${id}`, careerlevel);
  }

  deleteCareerLevel(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteCareerLevel/${id}`);
  }


  getLevels(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getLevel`);
  }

  getCareers(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getCareer`);
  }
}
