import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DailyMenuDTO, ExtraDTO, FitMealDTO, OrderItemDTO, RegularMealDTO } from '../../dtos/OrderDTO';
import { OrderService } from '../../services/order.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderDisplayItem } from '../../display/order-item-display';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {

  @ViewChild('orderCard') orderCard!: ElementRef;

  dailyMenu!: DailyMenuDTO;
  selectedMealType: string = "";
  arrayForms: FormGroup[] = [];
  price: number = 0;
  date: Date = new Date();
  orderDisplayItems: OrderDisplayItem[] = [];
  displayColumns: string[] = ['id', 'name', 'quantity', 'totalPrice', 'remove'];
  orderDispl: OrderDisplayItem | undefined;
  isToday: boolean = true;
  submitMsg: string = '';


  constructor(private scrooler: ViewportScroller, private route: ActivatedRoute, private orderService: OrderService, private snackBar: MatSnackBar) {
    const regularMealForm = new FormGroup({
      mealType: new FormControl('', Validators.required),
      quantity: new FormControl(0, [Validators.required, Validators.min(1)])
    });

    const fitMealForm = new FormGroup({
      quantity: new FormControl(0, [Validators.required, Validators.min(1)])
    });
    const soupForm = new FormGroup({
      quantity: new FormControl(0, [Validators.required, Validators.min(1)])
    });
    const dessertForm = new FormGroup({
      quantity: new FormControl(0, [Validators.required, Validators.min(1)])
    });

    this.arrayForms.push(regularMealForm);
    this.arrayForms.push(fitMealForm);
    this.arrayForms.push(soupForm);
    this.arrayForms.push(dessertForm);

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const day = params['day'];
      if (day === 'today' || day === undefined) {
        this.isToday = true;
        this.orderService.deleteAllItems();
        this.orderDisplayItems = [];
        this.submitMsg = "";
        this.loadMeals();
      } else if (day === 'tomorrow') {
        this.isToday = false;
        this.orderService.deleteAllItems();
        this.orderDisplayItems = [];
        this.submitMsg = "";
        this.loadMeals();
      }
    });
  }


  loadMeals() {
    this.orderService.getMeals(this.isToday).subscribe(
      (dailyMenu: DailyMenuDTO) => {
        this.dailyMenu = dailyMenu;
      },
      error => {
        this.snackBar.open('Error fetching menu', undefined, {
          duration: 2000,
        });
      }
    );
  }

  saveOrderItem(id: number, orderNum: number, name: string,
    price: number, priceLarge: number = 0, isNotReg = 1) {

    const quantity = this.arrayForms[orderNum].get("quantity")?.value;
    this.orderService.saveOrderItem(id, quantity, this.selectedMealType);
    if (priceLarge !== 0)
      price = priceLarge;

    if (isNotReg == 0) {
      name = name + " " + this.selectedMealType;
    }

    this.orderDispl = new OrderDisplayItem(id, name, quantity, price, this.selectedMealType)
    this.orderDisplayItems.push(this.orderDispl);

    console.log(this.orderDispl.id + " " + this.orderDispl.name + " " + this.orderDispl.price + " " + this.orderDispl.quantity,
      + " " + this.orderDispl.totalPrice + " " + this.orderDispl.type + " type");

    this.selectedMealType = '';
  }

  submitOrder() {
    this.orderService.placeOrder(this.isToday).subscribe(response => {
      this.submitMsg = "Your order was successfully submitted";
    }, error => {
      this.submitMsg = "Error: " + error.status;
      this.snackBar.open('Error occurred in HTTP request', undefined, {
        duration: 2000,
      });
    });
    this.orderDisplayItems = [];

  }

  updatePrice() {
    const mealType = this.arrayForms[0]?.get('mealType')?.value;
    this.price = mealType === 'LARGE' ? this.dailyMenu.regular.largePrice : this.dailyMenu.regular.smallPrice;
    this.selectedMealType = mealType;
  }



  deleteRow(item: any) {
    const index = this.orderDisplayItems.indexOf(item);
    if (index > -1) {
      this.orderDisplayItems.splice(index, 1);
      this.orderService.deleteOrderItem(index);
    }
  }

  correctTime(): boolean {

    const currentTime = this.date.getHours();
    if ((currentTime >= 8 && currentTime <= 10) || !this.isToday)
      return true;
    else
      return false;
  }
}
