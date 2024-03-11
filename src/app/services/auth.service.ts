import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequestDTO } from '../dtos/LoginRequestDTO';
import { LoginResponseDTO } from '../dtos/LoginResponseDTO';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { UserDTO } from '../dtos/UserDTO';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequestDTO): Observable<LoginResponseDTO> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<LoginResponseDTO>((`${environment.apiUrl}auth/login`), loginRequest, { headers });
  }

  public registerUser(user: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${environment.apiUrl}}/register`,user);
   }
}
