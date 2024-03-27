import { Component, Inject, OnInit } from '@angular/core';
import { MealService } from '../../services/meal.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CreateExtraDTO, CreateFitMealDTO, CreateRegularMealDTO, ExtraDTO, FitMealDTO, RegularMealDTO } from '../../dtos/MenuDTO';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-meal-form',
  templateUrl: './edit-meal-form.component.html',
  styleUrl: './edit-meal-form.component.css'
})
export class EditMealFormComponent implements OnInit {

  dataSourceRegular: MatTableDataSource<RegularMealDTO> = new MatTableDataSource<RegularMealDTO>();
  dataSourceFit: MatTableDataSource<FitMealDTO> = new MatTableDataSource<FitMealDTO>();
  dataSourceExtra: MatTableDataSource<ExtraDTO> = new MatTableDataSource<ExtraDTO>();

  mealsFormRegular!: FormGroup;
  mealsFormFit!: FormGroup;
  mealsFormExtra!: FormGroup;
  selectForm !: FormGroup;
  mealTypes = ['Regular', 'Fit', 'Extra'];
  shouldGetData: boolean = false;
  mealType = "";
  displayedForm !: FormGroup;

  constructor(private service: MealService, @Inject(MAT_DIALOG_DATA) public data: any, public matDialogRef: MatDialogRef<EditMealFormComponent>, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.shouldGetData = false;
    this.mealType = this.data.mealType;
    let shouldOrder;
    if (this.data.element.shouldOrderEarly) {
      shouldOrder = 'true';
    } else {
      shouldOrder = 'false';
    }
    if (this.mealType == 'Regular') {
      this.mealsFormRegular = new FormGroup({
        name: new FormControl(this.data.element.name, Validators.required),
        description: new FormControl(this.data.element.description, Validators.required),
        smallPrice: new FormControl(this.data.element.smallPrice, Validators.required),
        largePrice: new FormControl(this.data.element.largePrice, Validators.required)
      });
    } else if (this.mealType == 'Fit') {
      this.mealsFormFit = new FormGroup({
        name: new FormControl(this.data.element.name, Validators.required),
        description: new FormControl(this.data.element.description, Validators.required),
        price: new FormControl(this.data.element.price, Validators.required),
        shouldOrderEarly: new FormControl(shouldOrder, Validators.required)
      });
    } else if (this.mealType == 'Extra') {
      this.mealsFormExtra = new FormGroup({
        name: new FormControl(this.data.element.name, Validators.required),
        description: new FormControl(this.data.element.description, Validators.required),
        extraType: new FormControl(this.data.element.extraType, Validators.required),
        price: new FormControl(this.data.element.price, Validators.required)
      });
    }
  }




  editFormRegular() {
    this.shouldGetData = true;
    let ret: CreateRegularMealDTO = {
      name: this.mealsFormRegular.get('name')?.value,
      description: this.mealsFormRegular.get('description')?.value,
      smallPrice: this.mealsFormRegular.get('smallPrice')?.value,
      largePrice: this.mealsFormRegular.get('largePrice')?.value
    };
    this.service.editRegularMeal(this.data.element.id, ret).subscribe(
      response => {
        console.log('successful');
      },
      error => {
        this.snackBar.open('An error occurred:', undefined, {
          duration: 2000,
        });
      }
    );
    this.matDialogRef.close(ret);
  }


  editFormFit() {
    this.shouldGetData = true;
    let ret: CreateFitMealDTO = {
      name: this.mealsFormFit.get('name')?.value,
      description: this.mealsFormFit.get('description')?.value,
      price: this.mealsFormFit.get('price')?.value,
      shouldOrderEarly: this.mealsFormFit.get('shouldOrderEarly')?.value
    };
    console.log(ret);
    this.service.editFitMeal(this.data.element.id, ret).subscribe(
      response => {
        console.log('successful');
      },
      error => {
        this.snackBar.open('An error occurred:', undefined, {
          duration: 2000,
        });
      }
    );
    this.matDialogRef.close(ret);

  }

  editFormExtra() {
    this.shouldGetData = true;
    let ret: CreateExtraDTO = {
      name: this.mealsFormExtra.get('name')?.value,
      description: this.mealsFormExtra.get('description')?.value,
      extraType: this.mealsFormExtra.get('extraType')?.value,
      price: this.mealsFormExtra.get('price')?.value
    };
    console.log(ret);
    this.service.editExtra(this.data.element.id, ret).subscribe(
      response => {
        console.log('successful');
      },
      error => {
        this.snackBar.open('An error occurred:', undefined, {
          duration: 2000,
        });
      }
    );
    this.matDialogRef.close(ret);

  }

  isFieldRegularInvalid(field: string) {
    const formControl = this.mealsFormRegular.get(field);
    return formControl?.invalid && formControl?.touched;
  }

  isFieldFitInvalid(field: string) {
    const formControl = this.mealsFormFit.get(field);
    return formControl?.invalid && formControl?.touched;
  }

  isFieldExtraInvalid(field: string) {
    const formControl = this.mealsFormExtra.get(field);
    return formControl?.invalid && formControl?.touched;
  }
}
