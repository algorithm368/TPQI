import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SkillUnitcodeService {

  private apiUrl = 'http://localhost:3000'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  createUskill(uskill: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createUskill`, uskill);
  }

  getUskills(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getUskill`);
  }

  updateUskill(id: number, uskill: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateUskill/${id}`, uskill);
  }

  deleteUskill(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteUskill/${id}`);
  }

  getUnitcodes(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getUnitcode`);
  }

  getSkills(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getSkill`);
  }
}
