import { Component, OnInit } from '@angular/core';
import { DailyMenuDTO, ExtraDTO, FitMealDTO, OrderItemDTO, RegularMealDTO } from '../../dtos/OrderDTO';
import { OrderService } from '../../services/order.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderDisplayItem } from '../../display/order-item-display';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit{
  
  dailyMenu!: DailyMenuDTO;
  selectedMealType: string ="";
  arrayForms: FormGroup[]=[];
  price: number = 0;
  date: Date = new Date();
  forTomorrow: boolean = true;
  orderDisplayItems: OrderDisplayItem[]=[];
  displayColumns: string[] = ['id','name', 'quantity','totalPrice','remove'];
  orderDispl: OrderDisplayItem | undefined;
  isToday:boolean = true;
  submitErrorMsg: string='';
  
  /*
 regularMeal: RegularMealDTO = {
  idMeal: 1,
  name: 'Pizza Velika',
  type: 'Type',
  description: 'Amazing meal bro try it bro trust me bro',
  largePrice: 10,
  smallPrice: 8
};

// Create FitMealDTO object
 fitMeal: FitMealDTO = {
  idMeal: 2,
  name: 'Fit Meal',
  price: 12,
  description: 'Description',
  shouldOrderEarly: true
};

// Create ExtraDTO objects for soup and dessert
 soup: ExtraDTO = {
  idExtra: 3,
  name: 'Soup',
  description: 'Soup Description',
  extraType: 'Soup',
  price: 5
};

 dessert: ExtraDTO = {
  idExtra: 4,
  name: 'Dessert',
  description: 'Dessert Description',
  extraType: 'Dessert',
  price: 3
};

// Create DailyMenuDTO object
 dailyMenu: DailyMenuDTO = {
  idDailyMenu: 1,
  dateMenu: '2024-03-13',
  regular: this.regularMeal,
  fit: this.fitMeal,
  soup: this.soup,
  dessert: this.dessert
};
*/
  

  constructor(private route: ActivatedRoute, private orderService: OrderService) {
    this.route.params.subscribe(params => {
      const day = params['day'];
      if (day === 'today' || day==='') {
        this.isToday = true;
        this.loadMeals();
      } else if (day === 'tomorrow') {
        this.isToday = false;
        this.loadMeals();
    }});
  }

  ngOnInit(): void {
    

    const regularMealForm = new FormGroup({
      mealType: new FormControl('', Validators.required),
      quantity: new FormControl(0, [Validators.required, Validators.min(1)])
    });

    const fitMealForm = new FormGroup({
      quantity: new FormControl(0, [Validators.required, Validators.min(1)])
    });
    const soupForm =  new FormGroup({
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
  
  
  

  loadMeals() {
   this.orderService.getMeals(this.isToday).subscribe(
    (dailyMenu: DailyMenuDTO) => {
      this.dailyMenu = dailyMenu;
    },
    error => {
      console.log('Error fetching menu:');
      this.dailyMenu= new DailyMenuDTO();
    }
  );;
  }

  saveOrderItem(id: number,orderNum: number, name: string,
      price:number, priceLarge:number=0, isNotReg=1 ) {
       
    const quantity = this.arrayForms[orderNum].get("quantity")?.value;
    this.orderService.saveOrderItem(id,quantity,this.selectedMealType);
    if (priceLarge!==0) 
      price=priceLarge;
    
    if (isNotReg==0)
      name = name + " " + this.selectedMealType;

    this.orderDispl = new OrderDisplayItem(id, name, quantity,price,this.selectedMealType)
    this.orderDisplayItems.push(this.orderDispl);
    alert("duzina displeja "  +  this.orderDisplayItems.length);
    console.log(this.orderDispl.id + " " + this.orderDispl.name + " " + this.orderDispl.price + " " + this.orderDispl.quantity,
     + " " + this.orderDispl.totalPrice+ " " + this.orderDispl.type + " type" );
    this.selectedMealType='';
  }

  submitOrder() {
    this.orderService.placeOrder(this.isToday).subscribe(response => {
      this.submitErrorMsg = "Order submitted successfully";
    }, error => {
      this.submitErrorMsg = "somethnig went wrong";
      console.error('Error occurred in HTTP request:', error);
    
 
 });
    this.orderDisplayItems=[];
    
  }

  updatePrice()  {
    const mealType = this.arrayForms[0]?.get('mealType')?.value;
    this.price = mealType === 'LARGE' ? this.dailyMenu.regular.largePrice : this.dailyMenu.regular.smallPrice;
  }

  

  deleteRow(item: any) {
      const index = this.orderDisplayItems.indexOf(item);
      if (index > -1) {
        this.orderDisplayItems.splice(index, 1);
        this.orderService.deleteOrderItem(index);
      }
    }

  correctTime(): boolean {
     
    const currentTime =  this.date.getHours();
    if ((currentTime>=8 && currentTime<=10) || this.forTomorrow) 
        return true;
    else
        return false;
  }

 
  }



