import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AllDetailsService {

  private apiUrl = 'http://localhost:3000'; // Replace with your backend URL

  constructor(private http: HttpClient) {}


  createAlldetails(alldetail: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createAlldetails`, alldetail);
  }

  getAlldetails(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getAlldetails`);
  }

  updateAlldetails(id: number, alldetail: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateAlldetails/${id}`, alldetail);
  }

  deleteAllDetails(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteAlldetails/${id}`);
  }

  getCareerLevel(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getCareerLevel`);
  }

  getDetails(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getDetails`);
  }
}
