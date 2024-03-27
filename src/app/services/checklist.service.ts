import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChosenOneDTO } from '../dtos/chosenOneDTO';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {

  constructor(private http: HttpClient) { }


  getTodayOrders(): Observable<ChosenOneDTO> {
    return this.http.get<ChosenOneDTO>(`${environment.apiUrl}chosen-one`);
  }

  markOrderAsPaid(userId: number) {
    return this.http.put<boolean>(`${environment.apiUrl}chosen-one/pay/${userId}`, null);
  }
}
