import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CareerlevelKnowledgeService {

  private apiUrl = 'http://localhost:3000'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  createClKnowlege(clknowlege: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createClKnowlege`, clknowlege);
  }

  getClKnowlege(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getClKnowlege`);
  }

  updateClKnowlege(id: number, clknowlege: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateClKnowlege/${id}`, clknowlege);
  }

  deleteClKnowlege(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteClKnowlege/${id}`);
  }



  getCareerLevel(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getCareerLevel`);
  }

  getKnowleges(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getKnowlege`);
  }
}
