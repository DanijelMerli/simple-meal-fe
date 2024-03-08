import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getToken() {
    return localStorage.getItem('token');
  }

  setToken(accessToken: string) {
    localStorage.setItem('token',accessToken);
  }

  clearToken(){
    localStorage.clear();
  }
}
