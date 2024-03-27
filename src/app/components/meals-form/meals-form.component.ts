import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CreateExtraDTO, CreateFitMealDTO, CreateRegularMealDTO, ExtraDTO, FitMealDTO, RegularMealDTO } from '../../dtos/MenuDTO';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MealService } from '../../services/meal.service';
import { MatDialogRef} from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-meals-form',
  templateUrl: './meals-form.component.html',
  styleUrl: './meals-form.component.css'
})
export class MealsFormComponent implements OnInit{
  dataSourceRegular: MatTableDataSource<RegularMealDTO> = new MatTableDataSource<RegularMealDTO>();
  dataSourceFit: MatTableDataSource<FitMealDTO> = new MatTableDataSource<FitMealDTO>();
  dataSourceExtra: MatTableDataSource<ExtraDTO> = new MatTableDataSource<ExtraDTO>();

  mealsFormRegular!: FormGroup;
  mealsFormFit!: FormGroup;
  mealsFormExtra!: FormGroup;
  selectForm !: FormGroup;
  mealTypes = ['Regular', 'Fit', 'Extra'];
  shouldGetData: boolean=false;
  mealType = "";
  displayedForm !: FormGroup;

  constructor(private service : MealService, public matDialogRef: MatDialogRef<MealsFormComponent>, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.shouldGetData = false;
    this.selectForm = new FormGroup( {
      mealsType: new FormControl('', Validators.required),
    })
    this.selectForm.get('mealsType')?.valueChanges.subscribe(selectedValue => {
      this.selectChange(selectedValue);
    });

    this.mealsFormRegular = new FormGroup( {
      name: new FormControl('', Validators.required),
      description:  new FormControl('', Validators.required),
      smallPrice:  new FormControl('', Validators.required),
      largePrice:  new FormControl('', Validators.required)
    });
    this.mealsFormFit = new FormGroup ({
      name: new FormControl('', Validators.required),
      description:  new FormControl('', Validators.required),
      price:  new FormControl('', Validators.required),
      shouldOrderEarly: new FormControl('', Validators.required)
    });
    this.mealsFormExtra = new FormGroup ({
      name: new FormControl('', Validators.required),
      description:  new FormControl('', Validators.required),
      extraType:  new FormControl('SOUP', Validators.required),
      price: new FormControl('', Validators.required)
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
    console.log(selectedValue);
    this.mealType = selectedValue;
    if(selectedValue == 'Regular') {
     this.displayedForm = this.mealsFormRegular;
    } else if(selectedValue == 'Fit') {
     this.displayedForm = this.mealsFormFit;
    } else if(selectedValue == 'Extra') {
     this.displayedForm = this.mealsFormExtra;
    }
 } 

  submitFormRegular() {
    let ret:CreateRegularMealDTO = {
      name: this.mealsFormRegular.get('name')?.value,
      description: this.mealsFormRegular.get('description')?.value,
      smallPrice: this.mealsFormRegular.get('smallPrice')?.value,
      largePrice: this.mealsFormRegular.get('largePrice')?.value
    };
    this.service.addRegularMeal(ret).subscribe(
      response => {
        console.log('successful');
      },
      error => {
        this.snackBar.open('An error occurred. Review all fields and try again', undefined, {
          duration: 2000,
        });
        }
    );    
    this.matDialogRef.close(ret);
  }

  submitFormFit() {
    let ret:CreateFitMealDTO = {
      name: this.mealsFormFit.get('name')?.value,
      description: this.mealsFormFit.get('description')?.value,
      price: this.mealsFormFit.get('price')?.value,
      shouldOrderEarly: this.mealsFormFit.get('shouldOrderEarly')?.value
    };
    console.log(ret);
    this.service.addFitMeal(ret).subscribe(
      response => {
        console.log('successful');
      },
      error => {
        this.snackBar.open('An error occurred. Review all fields and try again', undefined, {
          duration: 2000,
        });
        }
    ); 
    this.matDialogRef.close(ret);   
  }

  submitFormExtra() {
    let ret:CreateExtraDTO = {
      name: this.mealsFormExtra.get('name')?.value,
      description: this.mealsFormExtra.get('description')?.value,
      extraType: this.mealsFormExtra.get('extraType')?.value,
      price: this.mealsFormExtra.get('price')?.value
    };
    console.log(ret);
    this.service.addExtraMeal(ret).subscribe(
      response => {
        console.log('successful');
      },
      error => {
        this.snackBar.open('An error occurred. Review all fields and try again', undefined, {
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
