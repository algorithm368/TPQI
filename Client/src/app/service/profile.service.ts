import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map ,of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private baseUrl = 'http://localhost:3000'; // Replace with your backend API URL

  constructor(private http: HttpClient) { }



  getProfile(): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/getProfile`;
    return this.http.get<any>(url, { headers });
  }

  getProfileById(id: number): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/getProfileById/${id}`;
    return this.http.get<any>(url, { headers });
  }


  updateProfile(id: number,updateProfile: any): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/updateProfile/${id}`;
    return this.http.put(url, updateProfile, { headers });
  }


  uploadProfileImage(userId: number, file: File): Observable<any> {

    const formData: FormData = new FormData();

    formData.append('actualFieldName', file, file.name);

    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/uploadProfileImage/${userId}`;
    return this.http.post<any>(url, formData , { headers });
  }




  getProfileSkill(): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/sprofile`;
    return this.http.get<any>(url, { headers });
  }

  getTotalSkillsCount(): Observable<any>{
    const url = `${this.baseUrl}/COUNTSkill`;
    return this.http.get<any>(url);
  }


  getProfileKnowledge(): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/kprofile`;
    return this.http.get<any>(url, { headers });
  }

  getTotalKnowledgeCount(): Observable<any>{
    const url = `${this.baseUrl}/COUNTKnowladge`;
    return this.http.get<any>(url);
  }


  // Insert a new profile record
  insertUsersSkills(usersskills: any): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage after login
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/usersSkills`;
    return this.http.post(url, usersskills, { headers });
  }

    
  getUsersSkills(id: number): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/getUsersSkills/${id}`;
    return this.http.get<any>(url, { headers });
  }


  updateUsersSkills(id: number, updatedLinkSkill: any): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/updateUserSkill/${id}`;
    return this.http.put(url, updatedLinkSkill, { headers });
  }

  deleteUsersSkills(id: number): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/deleteUserSkill/${id}`;
    return this.http.delete(url, { headers });
  }


  insertUsersKnowledge(usersknowledge: any): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage after login
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/usersKnowledge`;
    return this.http.post(url, usersknowledge, { headers });
  }



  getUsersKnowledge(id: number): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/getUsersKnowledge/${id}`;
    return this.http.get<any>(url, { headers });
  }


  updateUsersKnowledge(id: number, updatedLinkKnowledge: any): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/updateUserKnowledge/${id}`;
    return this.http.put(url, updatedLinkKnowledge, { headers });
  }

  deleteUsersKnowledge(id: number): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/deleteUserKnowledge/${id}`;
    return this.http.delete(url, { headers });
  }



  chartUnitcode(id: number): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/chartUnitcode/${id}`;
    return this.http.get<any>(url, { headers });
  }


  COUNTunitcode(): Observable<any>{
    const url = `${this.baseUrl}/COUNTunitcode`;
    return this.http.get<any>(url);
  }



}
