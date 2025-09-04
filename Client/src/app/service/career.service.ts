import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CareerService {

  private apiUrl = 'http://localhost:3000'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  getCareerLevelById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getCareerLevels/${id}`);
  }

  getCertificationById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/certification/${id}`);
  }

  getTargetGroupById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/TargetGroup/${id}`);
  }

  getOccupationalById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Occupational/${id}`);
  }

  getSectorById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Sector/${id}`);
  }



  getUnitCode(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getUnitCode/${id}`);
  }


  getCareerLevels(nameCareer?: string, nameLevel?: string): Observable<any> {
    let params = new HttpParams();
    
    if (nameCareer) {
      params = params.set('name_career', nameCareer);
    }

    if (nameLevel) {
      params = params.set('name_level', nameLevel);
    }

    return this.http.get(`${this.apiUrl}/getCareerLevels`, { params });
  }
}
