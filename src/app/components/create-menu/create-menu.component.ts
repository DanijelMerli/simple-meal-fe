import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MealService } from '../../services/meal.service';
import { ExtraDTO, FitMealDTO, RegularMealDTO } from '../../dtos/MenuDTO';

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

  selectChange(selectedValue: any) {
    console.log(selectedValue);
    this.selectedMealType = selectedValue;
  }

  async getAll(): Promise<void> {
    try {
      let result = await this.service.getMeals().toPromise();
      if (result != undefined) {
        console.log(result);
        this.regulars = result.regularMeals;
        this.fits = result.fitMeals;
        this.soups = result.extras.filter((m: { extraType: string }) => m.extraType === "SOUP");
        this.desserts = result.extras.filter((m: { extraType: string }) => m.extraType === "DESSERT");
        console.log(this.soups);
        console.log(this.desserts);
      } else {
        console.log(":-(")
      }
    }
   catch (error) {
    console.log(error)
  }
  }
}
