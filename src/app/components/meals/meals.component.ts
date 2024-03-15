import { Component,OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ExtraDTO, FitMealDTO, RegularMealDTO } from '../../dtos/MenuDTO';
import { MealService } from '../../services/meal.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.css'
})
export class MealsComponent implements OnInit{

  dataSourceRegular: MatTableDataSource<RegularMealDTO> = new MatTableDataSource<RegularMealDTO>();
  dataSourceFit: MatTableDataSource<FitMealDTO> = new MatTableDataSource<FitMealDTO>();
  dataSourceExtra: MatTableDataSource<ExtraDTO> = new MatTableDataSource<ExtraDTO>();
  displayedColumns !: string[];
  mealType = "";
  selectForm !: FormGroup;
  mealTypes = ['Regular', 'Fit', 'Extra'];


  constructor(private service : MealService) {}
  ngOnInit(): void {
    this.getAll();
    this.selectForm = new FormGroup( {
      mealsType: new FormControl('', Validators.required),
    })
    this.selectForm.get('mealsType')?.valueChanges.subscribe(selectedValue => {
      this.selectChange(selectedValue);
    });
  }

  async getAll(): Promise<void> {
    try {
      let result = await this.service.getMeals().toPromise();
      this.dataSourceRegular = new MatTableDataSource<RegularMealDTO>(result.regularMeals);
      this.dataSourceFit = new MatTableDataSource<FitMealDTO>(result.fitMeals);
      this.dataSourceExtra = new MatTableDataSource<ExtraDTO>(result.extras);
      console.log(result);
    }
   catch (error) {
    console.log(error)
  }
  }

  selectChange(selectedValue: any) {
     console.log(selectedValue);
     this.mealType = selectedValue;
     if(selectedValue == 'Regular') {
      this.displayedColumns = ['name', 'description', 'smallPrice', 'largePrice', 'actions'];
     } else if(selectedValue == 'Fit') {
      this.displayedColumns = ['name', 'description', 'price', 'shouldOrderEarly', 'actions'];
     } else if(selectedValue == 'Extra') {
      this.displayedColumns = ['name', 'description', 'price', 'extraType', 'actions'];
     }
  } 

  editRegular(element:RegularMealDTO) {

  }

  editFit(element:FitMealDTO) {
    
  }

  editExtra(element:ExtraDTO) {
    
  }

  deleteRegular(element:RegularMealDTO) {
    
  }

  deleteFit(element:FitMealDTO) {
    
  }

  deleteExtra(element:ExtraDTO) {
    
  }

}
