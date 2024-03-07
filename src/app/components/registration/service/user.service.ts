import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDTO } from '../dto/UserDTO';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url ='http://localhost:8080';
   httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  public registerUser(user: UserDTO): Observable<UserDTO> {
   return this.http.post<UserDTO>(`${this.url}/register`,user,this.httpOptions);
  }
}
