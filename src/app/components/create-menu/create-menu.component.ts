import { Component, OnInit, ViewChild  } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';
import { MealService } from '../../services/meal.service';
import { ExtraDTO, FitMealDTO, RegularMealDTO } from '../../dtos/MenuDTO';
import {CdkDragDrop, CdkDrag, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-create-menu',
  templateUrl: './create-menu.component.html',
  styleUrl: './create-menu.component.css',
  providers: [provideNativeDateAdapter()],
})
export class CreateMenuComponent implements OnInit {
  selectForm!: FormGroup;
  mealTypes: any[] = ["Regular", "Fit", "Soup", "Dessert"];
  selectedMealType: string = "";
  cardsCurrentMeals: any;
  regulars!: RegularMealDTO[];
  fits!: FitMealDTO[];
  soups!: ExtraDTO[];
  desserts!: ExtraDTO[];

  chosenRegulars: RegularMealDTO[] = [];
  chosenFits: FitMealDTO[] = [];
  chosenSoups: ExtraDTO[] = [];
  chosenDesserts: ExtraDTO[] = [];

  @ViewChild('regularList') regularList!: CdkDropList<RegularMealDTO>;
  @ViewChild('fitList') fitList!: CdkDropList<FitMealDTO>;
  @ViewChild('soupList') soupList!: CdkDropList<ExtraDTO>;
  @ViewChild('dessertList') dessertList!: CdkDropList<ExtraDTO>;

  @ViewChild('chosenRegularList') chosenRegularList!: CdkDropList<any>;
  @ViewChild('chosenFitList') chosenFitList!: CdkDropList<FitMealDTO>;
  @ViewChild('chosenSoupList') chosenSoupList!: CdkDropList<ExtraDTO>;
  @ViewChild('chosenDessertList') chosenDessertList!: CdkDropList<ExtraDTO>;

  myFilter = (d: Date | null): boolean => {
    const currentDate = new Date().getDate();
    const selectedDate = d || new Date();
    return selectedDate.getDay() !== 0 && selectedDate.getDay() !== 6 && selectedDate.getDate() >= currentDate;
  };

  selectedDate!: Date;


  constructor(private service : MealService) {}

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

  ngAfterViewInit() {
  }

  selectChange(selectedValue: any) {
    console.log(selectedValue);
    this.selectedMealType = selectedValue;
  }


  async getAll(): Promise<void> {
    try {
      let result = await this.service.getMeals().toPromise();
      if (result != undefined) {
        this.regulars = result.regularMeals;
        // this.chosenRegulars = result.fitMeals;
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

  dropRegular(event: any) {
    console.log(event);
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
  

  dropFit(event: CdkDragDrop<FitMealDTO[]>) {
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

  dropSoup(event: CdkDragDrop<ExtraDTO[]>) {
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

  dropDessert(event: CdkDragDrop<ExtraDTO[]>) {
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

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  onDateChange(event: any): void {
    // console.log(event.value); // selected date
    this.selectedDate = event.value;
    // console.log(this.selectedDate);
  }

  submitMeals() {
    console.log("hello")
    console.log(this.chosenRegulars);
    console.log(this.chosenFits);
    console.log(this.chosenSoups);
    console.log(this.chosenFits);
  }
}
