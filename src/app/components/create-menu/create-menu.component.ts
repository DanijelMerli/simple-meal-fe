import { Component, OnInit, ViewChild  } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MealService } from '../../services/meal.service';
import { ExtraDTO, FitMealDTO, RegularMealDTO } from '../../dtos/MenuDTO';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-create-menu',
  templateUrl: './create-menu.component.html',
  styleUrl: './create-menu.component.css'
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

  @ViewChild('chosenRegularList') chosenRegularList!: CdkDropList<RegularMealDTO>;
  @ViewChild('chosenFitList') chosenFitList!: CdkDropList<FitMealDTO>;
  @ViewChild('chosenSoupList') chosenSoupList!: CdkDropList<ExtraDTO>;
  @ViewChild('chosenDessertList') chosenDessertList!: CdkDropList<ExtraDTO>;

  constructor(private service : MealService) {}

  ngOnInit(): void {
    this.selectForm = new FormGroup( {
      mealType: new FormControl('Regular', Validators.required),
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

  dropRegular(event: CdkDragDrop<RegularMealDTO[]>) {
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

  dropFit(event: CdkDragDrop<FitMealDTO[]>) {
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

  dropSoup(event: CdkDragDrop<ExtraDTO[]>) {
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

  dropDessert(event: CdkDragDrop<ExtraDTO[]>) {
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
}
