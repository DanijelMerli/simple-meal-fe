import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private jwtHelper: JwtHelperService) { }

  getToken() {
    return localStorage.getItem('token');
  }

  setToken(accessToken: string) {
    localStorage.setItem('token',accessToken);
  }

  getRole() {
    const token = this.getToken();
    const decodedToken = this.jwtHelper.decodeToken(token as string);
    return decodedToken.role;
  }

  clearToken(){
    localStorage.clear();
  }

  isLoggedIn() {
    console.log(this.getToken());
    return !!this.getToken(); 
  }

  logOut() {
    this.clearToken();
  }

}
