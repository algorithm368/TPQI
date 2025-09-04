import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeService {

  private apiUrl = 'http://localhost:3000'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  createKnowlege(knowlege: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createKnowlege`, knowlege);
  }

  getKnowleges(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getKnowlege`);
  }

  updateKnowlege(id: number, knowlege: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateKnowlege/${id}`, knowlege);
  }

  deleteKnowlege(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteKnowlege/${id}`);
  }
}
