import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { WeeklyMenuAdminDTO } from '../dtos/MenuDTO';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  getMenu():Observable<any>{
    return this.http.get(`${environment.apiUrl}meals/this-week`);
  }

  getNextMenu():Observable<any>{
    return this.http.get(`${environment.apiUrl}meals/next-week`);
  }

  saveWeeklyMenu(menu: WeeklyMenuAdminDTO): Observable<any> {
    return this.http.post(`${environment.apiUrl}meals/save-weekly-menu`, menu);
  }
}
