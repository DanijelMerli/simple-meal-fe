import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CreateExtraDTO, CreateFitMealDTO, CreateRegularMealDTO, ExtraDTO, FitMealDTO, RegularMealDTO } from '../../dtos/MenuDTO';
import { MealService } from '../../services/meal.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MealsFormComponent } from '../meals-form/meals-form.component';
import { EditMealFormComponent } from '../edit-meal-form/edit-meal-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.css'
})
export class MealsComponent implements OnInit {

  dataSourceRegular: MatTableDataSource<RegularMealDTO> = new MatTableDataSource<RegularMealDTO>();
  dataSourceFit: MatTableDataSource<FitMealDTO> = new MatTableDataSource<FitMealDTO>();
  dataSourceExtra: MatTableDataSource<ExtraDTO> = new MatTableDataSource<ExtraDTO>();
  displayedColumns !: string[];
  mealType = "";
  selectForm !: FormGroup;
  mealTypes = ['Regular', 'Fit', 'Extra'];
  regularMeal !: CreateRegularMealDTO;



  constructor(private service: MealService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.mealType = 'Regular';
    this.displayedColumns = ['name', 'description', 'smallPrice', 'largePrice', 'actions'];
    this.getAll();
    this.selectForm = new FormGroup({
      mealsType: new FormControl('Regular', Validators.required),
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
    }
    catch (error) {
      this.snackBar.open('An error occurred', undefined, {
        duration: 2000,
      });
    }
  }

  selectChange(selectedValue: any) {
    this.mealType = selectedValue;
    if (selectedValue == 'Regular') {
      this.displayedColumns = ['name', 'description', 'smallPrice', 'largePrice', 'actions'];
    } else if (selectedValue == 'Fit') {
      this.displayedColumns = ['name', 'description', 'price', 'shouldOrderEarly', 'actions'];
    } else if (selectedValue == 'Extra') {
      this.displayedColumns = ['name', 'description', 'price', 'extraType', 'actions'];
    }
  }

  add() {
    const dialogRef = this.dialog.open(MealsFormComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (this.mealType == 'Regular') {
          let dto: CreateRegularMealDTO = {
            name: result.name,
            description: result.description,
            smallPrice: result.smallPrice,
            largePrice: result.largePrice
          }
        } else if (this.mealType == 'Fit') {
          let dto: CreateFitMealDTO = {
            name: result.name,
            description: result.description,
            price: result.price,
            shouldOrderEarly: result.shouldOrderEarly
          }
        } else if (this.mealType == 'Extra') {
          let dto: CreateExtraDTO = {
            name: result.name,
            description: result.description,
            price: result.price,
            extraType: result.extraType
          }
        }
      }
      this.getAll();
    });
  }

  editRegular(element: RegularMealDTO) {
    const dialogRef = this.dialog.open(EditMealFormComponent, {
      data: { element: element, mealType: this.mealType },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAll();
    });
  }


  editFit(element: FitMealDTO) {
    const dialogRef = this.dialog.open(EditMealFormComponent, {
      data: { element: element, mealType: this.mealType },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAll();
    });
  }

  editExtra(element: ExtraDTO) {
    const dialogRef = this.dialog.open(EditMealFormComponent, {
      data: { element: element, mealType: this.mealType },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAll();
    });
  }

  deleteRegular(element: RegularMealDTO) {
    if (confirm("Are you sure?") == true) {
      this.service.deleteMeals(element.id).subscribe({
        next: (result: any) => {
          this.getAll();
        }
      });
    }
  }

  deleteFit(element: FitMealDTO) {
    if (confirm("Are you sure?") == true) {
      this.service.deleteMeals(element.id).subscribe({
        next: (result: any) => {
          this.getAll();
        }
      });
    }
  }

  deleteExtra(element: ExtraDTO) {
    if (confirm("Are you sure?") == true) {
      this.service.deleteMeals(element.id).subscribe({
        next: (result: any) => {
          this.getAll();
        }
      });
    }
  }
}
