import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  private apiUrl = 'http://localhost:3000'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  createSkill(skill: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createSkill`, skill);
  }

  getSkills(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getSkill`);
  }

  updateSkill(id: number, skill: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateSkill/${id}`, skill);
  }

  deleteSkill(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteSkill/${id}`);
  }
}
