import { Component, OnInit, ViewChild  } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { MealService } from '../../services/meal.service';
import { ExtraDTO, FitMealDTO, RegularMealDTO } from '../../dtos/MenuDTO';
import {CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {provideNativeDateAdapter} from '@angular/material/core';

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

  chosenRegulars!: RegularMealDTO[];
  chosenFits!: FitMealDTO[];
  chosenSoups!: ExtraDTO[];
  chosenDesserts!: ExtraDTO[];

  @ViewChild('regularList') regularList!: CdkDropList<RegularMealDTO>;
  @ViewChild('fitList') fitList!: CdkDropList<FitMealDTO>;
  @ViewChild('soupList') soupList!: CdkDropList<ExtraDTO>;
  @ViewChild('dessertList') dessertList!: CdkDropList<ExtraDTO>;


  selectedDate!: Date;

  mealTypess = [
    { key: 'regular', title: 'Regulars' },
    { key: 'fit', title: 'Fits' },
    { key: 'soup', title: 'Soups' },
    { key: 'dessert', title: 'Desserts' }
  ];

  days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]; 

  chosenMeals: { [day: string]: { [mealType: string]: any[] } } = {};


  constructor(private service : MealService) {
    this.days.forEach(day => {
      this.chosenMeals[day] = {};
      this.mealTypess.forEach(mealType => {
          this.chosenMeals[day][mealType.key] = [];
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
      let result = await this.service.getMeals().toPromise();
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

  saveMenu() {
    console.log(this.chosenMeals)
  }
}

