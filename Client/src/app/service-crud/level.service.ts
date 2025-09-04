import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LevelService {

  private apiUrl = 'http://localhost:3000'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  createLevel(level: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createLevel`, level);
  }

  getLevels(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getLevel`);
  }

  updateLevel(id: number, level: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateLevel/${id}`, level);
  }

  deleteLevel(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteLevel/${id}`);
  }
}
