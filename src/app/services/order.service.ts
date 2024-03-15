import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { DailyMenuDTO, OrderDTO, OrderItemDTO } from '../dtos/OrderDTO';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  order!: OrderDTO;
  orderItems!: OrderItemDTO[];
  orderItem!: OrderItemDTO;

  constructor(private http: HttpClient) {
   }
 

  getMeals(isToday: boolean): Observable<DailyMenuDTO> {
    if (isToday)
    return this.http.get<DailyMenuDTO>(`${environment.apiUrl}meals/daily-menu/today`);
  else 
    return this.http.get<DailyMenuDTO>(`${environment.apiUrl}meals/daily-menu/tomorrow`);
  }

  saveOrderItem(id:number, quantity:number,type:any)  {
  
    if (!this.orderItems)
        this.orderItems=[];
    this.orderItem = new OrderItemDTO(id, quantity,type) ;

    this.orderItems.push(this.orderItem);

      
  }

  deleteOrderItem(index: number) {
    this.orderItems.splice(index,1);
  }

  placeOrder(isToday: boolean): Observable<OrderDTO> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    
        this.order= new OrderDTO(this.orderItems,isToday);
        alert(this.order.orderItems.length + " " + this.order.forToday + " " );
        this.orderItems=[];
        
        this.loopThroughProperties(this.order);
        return this.http.post<OrderDTO>(`${environment.apiUrl}order`,this.order,{headers});
  }

  loopThroughProperties(obj: OrderDTO): void {
    console.log(obj.forToday);
    obj.orderItems.forEach((element) => console.log(element.mealId + " " + element.mealCount + " "+ element.mealSize));
    console.log(obj.forToday);
    
    }
  }


  
  
