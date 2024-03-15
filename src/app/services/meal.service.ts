import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { WeeklyMenuDTO } from '../dtos/MenuDTO';

@Injectable({
  providedIn: 'root'
})
export class MealService {

  constructor(private http: HttpClient) { }

  getMeals():Observable<any>{
    return this.http.get(`${environment.apiUrl}meal`);
  }
}
