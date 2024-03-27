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
  orderDisplayItems: OrderDisplayItem[]=[];
  orderDispl: OrderDisplayItem | undefined;
  isToday:boolean = true;
  submitMsg: string='';
  isWeekend: boolean = false;
  isWeekendTomorrow: boolean = false;
  isHoliday: boolean = false;
  isHolidayTomorrow: boolean = false;
  
  
  


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
    this.checkWeekend();
    this.checkWeekendTomorrow();
    this.checkHoliday();
    this.checkHolidayTomorrow();
    
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
    this.orderService.saveOrderItem(id,quantity,this.selectedMealType);
    if (isNotReg==0 && this.selectedMealType=="LARGE")
      price=priceLarge;
    
    if (isNotReg==0) {
      name = name + " " + this.selectedMealType;
    }
    if (!isNotReg) {
      const foundItemReg = this.orderDisplayItems.find(el => el.id === id && el.type === this.selectedMealType);
      if (foundItemReg) {
        foundItemReg.quantity=foundItemReg.quantity+quantity;
        foundItemReg.totalPrice = foundItemReg.quantity * price;
    
      } else {
      this.orderDispl = new OrderDisplayItem(id, name, quantity,price,this.selectedMealType);
      this.orderDisplayItems.push(this.orderDispl);
    }
  } else {
    const foundItem = this.orderDisplayItems.find(el => el.id === id);
        if (foundItem) {
          foundItem.quantity=foundItem.quantity+quantity;
          foundItem.totalPrice =  foundItem.quantity * price;
        } else {
    this.orderDispl = new OrderDisplayItem(id, name, quantity,price,this.selectedMealType);
    this.orderDisplayItems.push(this.orderDispl);
        }
      }
  }

   
   
    
  

  submitOrder() {
    this.orderService.placeOrder(this.isToday).subscribe(response => {
      this.submitMsg = "Your order was successfully submitted";
    }, error => {
      this.submitMsg = "Error: " + error.message;
    
 
 });
    this.orderDisplayItems=[];
    
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

  

  checkHoliday() {
      return this.orderService.isHoliday().subscribe((response: boolean) => {
        this.isHoliday = response;
      },
      (error) => {
        console.error("Error fetching weekend status:", error);
      });
  }

  checkWeekend() {
    return this.orderService.isWeekend().subscribe((response: boolean) => {
      this.isWeekend = response;
    },
    (error) => {
      console.error("Error fetching weekend status:", error);
    });

  }

  checkHolidayTomorrow() {
    return this.orderService.isHolidayTomorrow().subscribe((response: boolean) => {
      this.isHolidayTomorrow = response;
    },
    (error) => {
      console.error("Error fetching weekend status:", error);
    });
}

checkWeekendTomorrow() {
  return this.orderService.isWeekendTomorrow().subscribe((response: boolean) => {
    this.isWeekendTomorrow = response;
  },
  (error) => {
    console.error("Error fetching weekend status:", error);
  });;

}


  correctTime(): boolean {
    const currentTime = this.date.getHours();
    if ((currentTime >= 8 && currentTime <= 10) || !this.isToday)
      return true;
    else
      return false;
  }
}
