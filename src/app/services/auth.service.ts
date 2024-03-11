import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequestDTO } from '../dtos/LoginRequestDTO';
import { LoginResponseDTO } from '../dtos/LoginResponseDTO';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:8080/api/auth/login'; 

  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequestDTO): Observable<LoginResponseDTO> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<LoginResponseDTO>(this.loginUrl, loginRequest, { headers });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }
}
