import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SectorService {

  private apiUrl = 'http://localhost:3000'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  createSector(sector: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createSector`, sector);
  }

  getSector(): Observable<any>{
    return this.http.get(`${this.apiUrl}/getSector`);
  }

  updateSector(id: number, sector: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateSector/${id}`, sector);
  }

  deleteSector(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteSector/${id}`);
  }
}
