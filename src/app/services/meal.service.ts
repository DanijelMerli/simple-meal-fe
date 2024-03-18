import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CreateExtraDTO, CreateFitMealDTO, CreateRegularMealDTO, WeeklyMenuDTO } from '../dtos/MenuDTO';

@Injectable({
  providedIn: 'root'
})
export class MealService {

  constructor(private http: HttpClient) { }

  getMeals():Observable<any>{
    return this.http.get(`${environment.apiUrl}meal`);
  }

  addRegularMeal(regular: CreateRegularMealDTO):Observable<any>{
    return this.http.post(`${environment.apiUrl}meal/regular`, regular);
  }

  addFitMeal(fit: CreateFitMealDTO):Observable<any>{
    return this.http.post(`${environment.apiUrl}meal/fit`, fit);
  }

  addExtraMeal(extra: CreateExtraDTO):Observable<any>{
    return this.http.post(`${environment.apiUrl}meal/extra`, extra);
  }

  editRegularMeal(id: number, updatedMealData: CreateRegularMealDTO):Observable<any>{
    return this.http.put(`${environment.apiUrl}meal/regular/${id}`, updatedMealData);
  }

  editFitMeal(id: number, updatedMealData: CreateFitMealDTO):Observable<any>{
    return this.http.put(`${environment.apiUrl}meal/fit/${id}`, updatedMealData);
  }

  editExtra(id: number, updatedMealData: CreateExtraDTO):Observable<any>{
    return this.http.put(`${environment.apiUrl}meal/extra/${id}`, updatedMealData);
  }
  
  deleteMeals(id:number):Observable<any>{
    return this.http.delete(`${environment.apiUrl}meal/${id}`);
  }
}
