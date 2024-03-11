import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequestDTO } from '../dtos/LoginRequestDTO';
import { LoginResponseDTO } from '../dtos/LoginResponseDTO';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequestDTO): Observable<LoginResponseDTO> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<LoginResponseDTO>((`${environment.apiUrl}auth/login`), loginRequest, { headers });
  }
}
