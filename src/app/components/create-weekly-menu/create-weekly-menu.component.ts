import { Component, OnInit, ViewChild  } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { MealService } from '../../services/meal.service';
import { ExtraDTO, FitMealDTO, RegularMealDTO, WeeklyMenuAdminDTO, DailyMenuAdminDTO } from '../../dtos/MenuDTO';
import {CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {provideNativeDateAdapter} from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-create-weekly-menu',
  templateUrl: './create-weekly-menu.component.html',
  styleUrl: './create-weekly-menu.component.css',
  providers: [provideNativeDateAdapter()],
})
export class CreateWeeklyMenuComponent implements OnInit {
  selectForm!: FormGroup;
  mealTypes: any[] = ["Regular", "Fit", "Soup", "Dessert"];
  selectedMealType: string = "";
  cardsCurrentMeals: any;
  regulars!: RegularMealDTO[];
  fits!: FitMealDTO[];
  soups!: ExtraDTO[];
  desserts!: ExtraDTO[];

  @ViewChild('regularList') regularList!: CdkDropList<RegularMealDTO>;
  @ViewChild('fitList') fitList!: CdkDropList<FitMealDTO>;
  @ViewChild('soupList') soupList!: CdkDropList<ExtraDTO>;
  @ViewChild('dessertList') dessertList!: CdkDropList<ExtraDTO>;


  selectedDate!: Date;

  mealTypeObj = [
    { key: 'regular', title: 'Regulars' },
    { key: 'fit', title: 'Fits' },
    { key: 'soup', title: 'Soups' },
    { key: 'dessert', title: 'Desserts' }
  ];

  days = ['Monday']; 
  dates!: string[];
  weekStart!: string;

  chosenMeals: { [day: string]: { [mealType: string]: any[] } } = {};


  constructor(private mealService : MealService, private route: ActivatedRoute, private menuService: MenuService) {
    this.route.queryParams.subscribe(params => {
      let week = params['week'];
      if (week == "this") {
        this.getDatesForRestOfWeek();
      } else {
        this.getDatesForNextWeek();
      }
    });
    this.days.forEach(day => {
      this.chosenMeals[day] = {};
      this.mealTypeObj.forEach(mealTypeObj => {
          this.chosenMeals[day][mealTypeObj.key] = [];
      });
    });
  }

  ngOnInit(): void {
    this.selectForm = new FormGroup( {
      mealType: new FormControl('Regular', Validators.required),
      datePicker: new FormControl('', Validators.required),
    })
    this.selectForm.get('mealType')?.valueChanges.subscribe(selectedValue => {
      this.selectChange(selectedValue);
    });
    this.selectedMealType = 'Regular'
    this.getAll();
  }

  selectChange(selectedValue: any) {
    this.selectedMealType = selectedValue;
  }


  async getAll(): Promise<void> {
    try {
      let result = await this.mealService.getMeals().toPromise();
      if (result != undefined) {
        this.regulars = result.regularMeals;
        this.fits = result.fitMeals;
        this.soups = result.extras.filter((m: { extraType: string }) => m.extraType === "SOUP");
        this.desserts = result.extras.filter((m: { extraType: string }) => m.extraType === "DESSERT");
      } else {
        console.log(":-(")
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  dropMeal(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const itemToMove = { ...event.previousContainer.data[event.previousIndex] };
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      event.previousContainer.data.splice(event.previousIndex, 0, itemToMove);
    }
  }

  dropBack(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const itemToMove = { ...event.previousContainer.data[event.previousIndex] };
      // transferArrayItem(
      //   event.previousContainer.data,
      //   event.container.data,
      //   event.previousIndex,
      //   event.currentIndex,
      // );
      event.previousContainer.data.splice(event.previousIndex, 1);
      //event.previousContainer.data.splice(event.previousIndex, 0, itemToMove);
    }
  }

  saveMenu() {
    let dailyMenus: DailyMenuAdminDTO[] = [];
    for (let i = 0; i < this.days.length; i++) {
      let day = this.days[i];
      let date = this.dates[i];
      let meals = this.chosenMeals[day];
      let regular: RegularMealDTO = meals['regular'][0];
      let fit: FitMealDTO = meals['fit'][0];
      let soup: ExtraDTO = meals['soup'][0];
      let dessert: ExtraDTO = meals['dessert'][0];

      let newDailyMenu: DailyMenuAdminDTO = {
        dateMenu: date,
        regularMealId: regular.id,
        fitMealId: fit.id,
        soupId: soup.id,
        dessertId: dessert.id
      }
      dailyMenus.push(newDailyMenu);
    }

    let newWeeklyMenu: WeeklyMenuAdminDTO = {
      idWeeklyMenu: -1,
      dailyMenus: dailyMenus,
      startDate: this.weekStart,
      imageData: null
    }

    console.log(newWeeklyMenu);
    this.menuService.saveWeeklyMenu(newWeeklyMenu).subscribe({
      next: (result: any) => {
        console.log(result)
      },
      error: (error: any) => {
        console.error(error)
      }
    });
  }

  getDatesForRestOfWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    let dates = [];
    let allDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let datesStr = [];

    const startOfWeek = new Date(today); 
    startOfWeek.setDate(today.getDate() - dayOfWeek); // Sunday
    this.weekStart = `${this.addZeros(startOfWeek.getDate())}-${this.addZeros(startOfWeek.getMonth() + 1)}-${startOfWeek.getFullYear()}.`;
    // (from tomorrow to Friday)
    for (let i = dayOfWeek + 1; i <= 5; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const formattedDate = `${this.addZeros(date.getDate())}-${this.addZeros(date.getMonth() + 1)}-${date.getFullYear()}.`;
        dates.push(formattedDate);
        datesStr.push(allDays[i]);
    }

    startOfWeek.setDate(today.getDate() - dayOfWeek + 1); // Monday
    this.weekStart = `${this.addZeros(startOfWeek.getDate())}-${this.addZeros(startOfWeek.getMonth() + 1)}-${startOfWeek.getFullYear()}.`;

    // console.log('this')
    // console.log(dates, datesStr);
    // console.log(this.weekStart);
    this.days = datesStr;
    this.dates = dates;
  }

  getDatesForNextWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    let dates = [];
    let allDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let datesStr = [];

    const startOfWeek = new Date(today); 
    startOfWeek.setDate(today.getDate() - dayOfWeek + 7); // Next Sunday
    
    // (from Monday to Friday)
    for (let i = 1; i <= 5; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const formattedDate = `${this.addZeros(date.getDate())}-${this.addZeros(date.getMonth() + 1)}-${date.getFullYear()}.`;
        dates.push(formattedDate);
        datesStr.push(allDays[i]);
    }

    startOfWeek.setDate(today.getDate() - dayOfWeek + 7 + 1); // Next Monday
    this.weekStart = `${this.addZeros(startOfWeek.getDate())}-${this.addZeros(startOfWeek.getMonth() + 1)}-${startOfWeek.getFullYear()}.`;
    // console.log('next')
    // console.log(dates, datesStr);
    // console.log(this.weekStart);
    this.days = datesStr;
    this.dates = dates;
  }

  addZeros(num: any) {
    return num.toString().padStart(2, '0');
  }
}

